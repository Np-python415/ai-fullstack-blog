/**
 * 本地博客 API 服务（端口 8000）
 * - GET    /posts        获取文章列表
 * - GET    /posts/:id    根据 ID 获取单篇文章
 * - POST   /posts        创建文章
 * - PUT    /posts/:id    更新文章
 * - DELETE /posts/:id    删除文章
 * 运行: node server/index.js
 */

const http = require("http");
// 切换到 SQLite 数据库（支持 Navicat 连接）
const db = require("./database-sqlite");

const PORT = 8000;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  // 处理 CORS 预检请求
  if (req.method === "OPTIONS") {
    sendJson(res, 200, {});
    return;
  }

  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  const match = pathname.match(/^\/posts(?:\/(\d+))?\/?$/);
  if (!match) {
    sendJson(res, 404, { error: "Not Found" });
    return;
  }

  const idParam = match[1];

  try {
    // GET /posts - 获取文章列表
    if (method === "GET" && !idParam) {
      const posts = await db.getAllPosts();
      sendJson(res, 200, posts);
      return;
    }

    // GET /posts/:id - 获取单篇文章
    if (method === "GET" && idParam) {
      const post = await db.findPostById(idParam);
      if (!post) {
        sendJson(res, 404, { error: "文章不存在" });
        return;
      }
      sendJson(res, 200, post);
      return;
    }

    // POST /posts - 创建文章
    if (method === "POST" && !idParam) {
      const body = await parseBody(req);
      if (!body.title || !body.content) {
        sendJson(res, 400, { error: "标题和内容不能为空" });
        return;
      }
      const newPost = await db.createPost({
        title: body.title,
        content: body.content,
        tags: Array.isArray(body.tags) ? body.tags : [],
      });
      sendJson(res, 201, newPost);
      return;
    }

    // PUT /posts/:id - 更新文章
    if (method === "PUT" && idParam) {
      const body = await parseBody(req);
      const updatedPost = await db.updatePost(idParam, {
        title: body.title,
        content: body.content,
        tags: Array.isArray(body.tags) ? body.tags : [],
      });
      if (!updatedPost) {
        sendJson(res, 404, { error: "文章不存在" });
        return;
      }
      sendJson(res, 200, updatedPost);
      return;
    }

    // DELETE /posts/:id - 删除文章
    if (method === "DELETE" && idParam) {
      const deleted = await db.deletePost(idParam);
      if (!deleted) {
        sendJson(res, 404, { error: "文章不存在" });
        return;
      }
      sendJson(res, 200, { message: "删除成功" });
      return;
    }

    sendJson(res, 405, { error: "Method Not Allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`博客 API 已启动: http://localhost:${PORT}`);
  console.log("  GET    /posts     - 文章列表");
  console.log("  GET    /posts/:id - 单篇文章");
  console.log("  POST   /posts     - 创建文章");
  console.log("  PUT    /posts/:id - 更新文章");
  console.log("  DELETE /posts/:id - 删除文章");
});
