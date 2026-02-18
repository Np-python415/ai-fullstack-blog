/**
 * 数据迁移脚本：从 JSON 文件迁移到 SQLite
 * 运行: node migrate-to-sqlite.js
 */

const fs = require("fs");
const path = require("path");

const JSON_DB_FILE = path.join(__dirname, "database/posts.json");
const SQLITE_DB_FILE = path.join(__dirname, "database/blog.db");

async function migrate() {
  try {
    // 检查 JSON 文件是否存在
    if (!fs.existsSync(JSON_DB_FILE)) {
      console.log("JSON 数据库文件不存在，无需迁移");
      return;
    }

    // 读取 JSON 数据
    const jsonData = JSON.parse(fs.readFileSync(JSON_DB_FILE, "utf-8"));
    console.log(`找到 ${jsonData.length} 篇文章，开始迁移...`);

    // 检查 sql.js 是否安装
    let initSqlJs;
    try {
      initSqlJs = require("sql.js");
    } catch (error) {
      console.error("错误: 请先安装 sql.js");
      console.error("运行: npm install sql.js");
      process.exit(1);
    }

    // 初始化 SQLite
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    // 创建新数据库或加载现有数据库
    let db;
    if (fs.existsSync(SQLITE_DB_FILE)) {
      console.log("SQLite 数据库已存在，加载中...");
      const buffer = fs.readFileSync(SQLITE_DB_FILE);
      db = new SQL.Database(buffer);
    } else {
      console.log("创建新的 SQLite 数据库...");
      db = new SQL.Database();
    }

    // 创建表
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT,
        createdAt TEXT NOT NULL
      )
    `);

    // 清空现有数据（如果存在）
    db.run("DELETE FROM posts");

    // 插入数据
    const stmt = db.prepare(
      "INSERT INTO posts (id, title, content, tags, createdAt) VALUES (?, ?, ?, ?, ?)"
    );

    jsonData.forEach((post) => {
      const tagsJson = JSON.stringify(post.tags || []);
      stmt.run([
        post.id,
        post.title,
        post.content,
        tagsJson,
        post.createdAt || post.created_at || new Date().toISOString(),
      ]);
    });

    stmt.free();

    // 保存数据库
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(SQLITE_DB_FILE, buffer);

    console.log(`✅ 迁移完成！${jsonData.length} 篇文章已迁移到 SQLite`);
    console.log(`数据库文件: ${SQLITE_DB_FILE}`);
    console.log("\n现在可以在 Navicat 中连接这个 SQLite 数据库了！");
    console.log("连接方式：");
    console.log("1. 打开 Navicat");
    console.log("2. 新建连接 -> SQLite");
    console.log("3. 数据库文件选择: " + SQLITE_DB_FILE);

    db.close();
  } catch (error) {
    console.error("迁移失败:", error);
    process.exit(1);
  }
}

migrate();
