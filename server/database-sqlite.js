/**
 * SQLite 数据库实现（基于 sql.js）
 * - 无需本地编译环境
 * - 数据落在 database/blog.db，可用 Navicat 打开
 * - 本实现从本地 node_modules/sql.js/dist 加载 wasm，不依赖网络
 */

const fs = require("fs");
const path = require("path");

let initSqlJs;
try {
  initSqlJs = require("sql.js");
} catch (e) {
  console.error("缺少依赖：sql.js。请先运行：npm install");
  throw e;
}

const DB_FILE = path.join(__dirname, "../database/blog.db");
const DB_DIR = path.dirname(DB_FILE);
const SQLJS_DIST_DIR = path.join(process.cwd(), "node_modules", "sql.js", "dist");

let dbInstance = null;
let dbInitialized = false;
let createdColumnName = "created_at"; // 兼容不同列名

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

function locateFile(file) {
  // sql.js 会请求 sql-wasm.wasm，直接指向本地文件
  return path.join(SQLJS_DIST_DIR, file);
}

function saveDatabase() {
  if (!dbInstance) return;
  const data = dbInstance.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

function ensureSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT,
      created_at TEXT NOT NULL
    )
  `);

  const pragma = db.exec("PRAGMA table_info(posts);");
  const cols = new Set((pragma[0]?.values || []).map((row) => String(row[1])));

  // 补 tags
  if (!cols.has("tags")) {
    db.run("ALTER TABLE posts ADD COLUMN tags TEXT;");
    cols.add("tags");
  }

  // 兼容 createdAt / created_at
  if (cols.has("created_at")) createdColumnName = "created_at";
  else if (cols.has("createdAt")) createdColumnName = "createdAt";
  else createdColumnName = "created_at";
}

function seedIfEmpty(db) {
  const countRes = db.exec("SELECT COUNT(*) FROM posts;");
  const count = Number(countRes[0]?.values?.[0]?.[0] ?? 0);
  if (count > 0) return;

  const insertSql = `INSERT INTO posts (title, content, tags, ${createdColumnName}) VALUES (?, ?, ?, ?)`;
  const stmt = db.prepare(insertSql);
  const initial = [
    {
      title: "欢迎来到我的【AI】驱动的全栈博客",
      content: "这是第一篇文章。在这里我会分享学习笔记与项目心得。\n\n希望你能有所收获。",
      tags: ["AI", "全栈"],
      created: "2025-02-01T10:00:00.000Z",
    },
    {
      title: "Next.js 服务端组件简介",
      content:
        "Next.js 14 的 App Router 默认使用服务端组件，可以在服务端直接 fetch 数据、访问数据库，减少客户端体积并提升首屏性能。",
      tags: ["Next.js", "前端"],
      created: "2025-02-03T14:30:00.000Z",
    },
    {
      title: "Tailwind CSS 使用技巧",
      content:
        "Tailwind 通过工具类快速实现样式。合理使用 @apply、组件化重复组合，并配合 dark: 实现深色模式，能让样式既统一又易维护。",
      tags: ["CSS", "前端"],
      created: "2025-02-05T09:15:00.000Z",
    },
  ];

  for (const p of initial) {
    stmt.run([p.title, p.content, JSON.stringify(p.tags), p.created]);
  }
  stmt.free();
  saveDatabase();
}

async function initDatabase() {
  if (dbInitialized) return dbInstance;
  ensureDir();

  const SQL = await initSqlJs({ locateFile });
  if (fs.existsSync(DB_FILE)) {
    dbInstance = new SQL.Database(fs.readFileSync(DB_FILE));
  } else {
    dbInstance = new SQL.Database();
  }

  ensureSchema(dbInstance);
  seedIfEmpty(dbInstance);

  dbInitialized = true;
  return dbInstance;
}

async function getDb() {
  if (!dbInitialized) await initDatabase();
  return dbInstance;
}

async function getAllPosts() {
  const db = await getDb();
  const res = db.exec(
    `SELECT id, title, content, tags, ${createdColumnName} as created_at FROM posts ORDER BY id DESC`
  );
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0],
    title: row[1],
    content: row[2],
    tags: row[3] ? JSON.parse(row[3]) : [],
    created_at: row[4],
  }));
}

async function findPostById(id) {
  const db = await getDb();
  const stmt = db.prepare(
    `SELECT id, title, content, tags, ${createdColumnName} as created_at FROM posts WHERE id = ?`
  );
  stmt.bind([parseInt(id, 10)]);
  const row = stmt.getAsObject();
  stmt.free();
  if (!row.id) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags ? JSON.parse(row.tags) : [],
    created_at: row.created_at,
  };
}

async function createPost(post) {
  const db = await getDb();
  const created = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO posts (title, content, tags, ${createdColumnName}) VALUES (?, ?, ?, ?)`
  );
  stmt.run([post.title, post.content, JSON.stringify(post.tags || []), created]);
  stmt.free();

  const idRes = db.exec("SELECT last_insert_rowid() as id");
  const newId = idRes[0].values[0][0];
  saveDatabase();
  return { id: newId, ...post, created_at: created };
}

async function updatePost(id, updates) {
  const db = await getDb();
  const stmt = db.prepare("UPDATE posts SET title = ?, content = ?, tags = ? WHERE id = ?");
  stmt.run([
    updates.title,
    updates.content,
    JSON.stringify(updates.tags || []),
    parseInt(id, 10),
  ]);
  const changed = stmt.getRowsModified();
  stmt.free();
  if (!changed) return null;
  saveDatabase();
  return findPostById(id);
}

async function deletePost(id) {
  const db = await getDb();
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
  stmt.run([parseInt(id, 10)]);
  const changed = stmt.getRowsModified();
  stmt.free();
  if (changed) saveDatabase();
  return changed > 0;
}

// 模块加载时预初始化（失败不阻塞启动，便于看日志）
initDatabase().catch((e) => console.error("SQLite 初始化失败：", e));

module.exports = { getAllPosts, findPostById, createPost, updatePost, deletePost };

