/**
 * 本地博客 API 服务（端口 8000）
 * - GET /posts        获取文章列表（保持不变）
 * - GET /posts/:id    根据 ID 获取单篇文章，找不到则 404 + 错误信息
 * 运行: node server/index.js
 */

const http = require("http");

const PORT = 8000;

const posts = [
  {
    id: 1,
    title: "欢迎来到我的【AI】驱动的全栈博客",
    content: "这是第一篇文章。在这里我会分享学习笔记与项目心得。\n\n希望你能有所收获。",
    createdAt: "2025-02-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Next.js 服务端组件简介",
    content: "Next.js 14 的 App Router 默认使用服务端组件，可以在服务端直接 fetch 数据、访问数据库，减少客户端体积并提升首屏性能。",
    createdAt: "2025-02-03T14:30:00.000Z",
  },
  {
    id: 3,
    title: "Tailwind CSS 使用技巧",
    content: "Tailwind 通过工具类快速实现样式。合理使用 @apply、组件化重复组合，并配合 dark: 实现深色模式，能让样式既统一又易维护。",
    createdAt: "2025-02-05T09:15:00.000Z",
  },
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  if (method !== "GET") {
    sendJson(res, 405, { error: "Method Not Allowed" });
    return;
  }

  const match = pathname.match(/^\/posts(?:\/(\d+))?\/?$/);
  if (!match) {
    sendJson(res, 404, { error: "Not Found" });
    return;
  }

  const idParam = match[1];

  if (!idParam) {
    sendJson(res, 200, posts);
    return;
  }

  const postId = parseInt(idParam, 10);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    sendJson(res, 404, { error: "文章不存在" });
    return;
  }

  sendJson(res, 200, post);
});

server.listen(PORT, () => {
  console.log(`博客 API 已启动: http://localhost:${PORT}`);
  console.log("  GET /posts     - 文章列表");
  console.log("  GET /posts/:id - 单篇文章（按 ID，未找到返回 404）");
});
