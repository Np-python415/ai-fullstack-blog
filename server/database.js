/**
 * 简单的文件数据库实现
 * 使用 JSON 文件存储数据，无需安装额外的数据库依赖
 */

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "../database/posts.json");
const DB_DIR = path.dirname(DB_FILE);

// 确保数据库目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 初始化数据库文件（如果不存在）
if (!fs.existsSync(DB_FILE)) {
  const initialData = [
    {
      id: 1,
      title: "欢迎来到我的【AI】驱动的全栈博客",
      content: "这是第一篇文章。在这里我会分享学习笔记与项目心得。\n\n希望你能有所收获。",
      tags: ["AI", "全栈"],
      createdAt: "2025-02-01T10:00:00.000Z",
    },
    {
      id: 2,
      title: "Next.js 服务端组件简介",
      content: "Next.js 14 的 App Router 默认使用服务端组件，可以在服务端直接 fetch 数据、访问数据库，减少客户端体积并提升首屏性能。",
      tags: ["Next.js", "前端"],
      createdAt: "2025-02-03T14:30:00.000Z",
    },
    {
      id: 3,
      title: "Tailwind CSS 使用技巧",
      content: "Tailwind 通过工具类快速实现样式。合理使用 @apply、组件化重复组合，并配合 dark: 实现深色模式，能让样式既统一又易维护。",
      tags: ["CSS", "前端"],
      createdAt: "2025-02-05T09:15:00.000Z",
    },
  ];
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
}

/**
 * 读取所有文章
 */
function getAllPosts() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("读取数据库失败:", error);
    return [];
  }
}

/**
 * 保存所有文章
 */
function saveAllPosts(posts) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(posts, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("保存数据库失败:", error);
    return false;
  }
}

/**
 * 获取下一篇文章 ID
 */
function getNextId() {
  const posts = getAllPosts();
  if (posts.length === 0) return 1;
  const maxId = Math.max(...posts.map((p) => p.id));
  return maxId + 1;
}

/**
 * 根据 ID 查找文章
 */
function findPostById(id) {
  const posts = getAllPosts();
  return posts.find((p) => p.id === parseInt(id, 10));
}

/**
 * 创建文章
 */
function createPost(post) {
  const posts = getAllPosts();
  const newPost = {
    id: getNextId(),
    ...post,
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  saveAllPosts(posts);
  return newPost;
}

/**
 * 更新文章
 */
function updatePost(id, updates) {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === parseInt(id, 10));
  if (index === -1) return null;
  posts[index] = {
    ...posts[index],
    ...updates,
    id: parseInt(id, 10), // 确保 ID 不被修改
  };
  saveAllPosts(posts);
  return posts[index];
}

/**
 * 删除文章
 */
function deletePost(id) {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === parseInt(id, 10));
  if (index === -1) return false;
  posts.splice(index, 1);
  saveAllPosts(posts);
  return true;
}

module.exports = {
  getAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
};
