# Next.js 全栈博客项目

一个现代化的全栈博客应用，使用 Next.js 14、TypeScript、Tailwind CSS 构建。

## ✨ 功能特性

### 前端功能
- ✅ **文章管理**：创建、编辑、删除文章（需要登录）
- ✅ **搜索功能**：按标题和内容搜索文章
- ✅ **标签系统**：文章标签管理和筛选
- ✅ **分页功能**：文章列表分页显示
- ✅ **AI 摘要生成**：使用 OpenAI API 生成文章摘要（RAG 工作流演示）
- ✅ **用户认证**：使用 Clerk 实现登录/注册功能
- ✅ **深色模式**：支持浅色/深色主题切换
- ✅ **响应式设计**：完美适配移动端和桌面端
- ✅ **加载状态**：优雅的加载和错误处理

### 后端功能
- ✅ **RESTful API**：完整的 CRUD 操作
- ✅ **AI API**：集成 OpenAI API，支持文章摘要生成
- ✅ **CORS 支持**：跨域请求支持
- ✅ **数据持久化**：SQLite 数据库存储
- ✅ **错误处理**：完善的错误响应机制
- ✅ **Serverless 就绪**：支持 Vercel Serverless Functions 部署

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React 框架（App Router）
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的 CSS 框架
- **React Hooks** - 状态管理
- **Clerk** - 用户认证系统
- **OpenAI API** - AI 功能集成

### 后端
- **Node.js** - 运行时环境
- **SQLite** - 轻量级关系型数据库（使用 sql.js，支持 Navicat 连接）
- **原生 HTTP 模块** - 简洁的 API 服务器
- **Next.js API Routes** - Serverless Functions（用于 AI 功能）

## 📦 项目结构

```
my-nextjs-demo/
├── app/                    # Next.js App Router
│   ├── blog/              # 博客相关页面
│   │   ├── [id]/         # 动态路由（文章详情）
│   │   │   ├── edit/     # 编辑页面
│   │   │   └── page.tsx  # 详情页
│   │   ├── new/          # 创建文章页面
│   │   └── page.tsx      # 博客列表页
│   ├── components/        # 组件
│   │   └── theme-toggle.tsx  # 主题切换组件
│   ├── lib/              # 工具函数
│   │   └── api.ts        # API 调用封装
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── server/               # 后端 API
│   ├── index.js         # API 服务器
│   ├── database.js     # JSON 数据库模块（已不使用）
│   └── database-sqlite.js  # SQLite 数据库模块
├── database/             # 数据库文件
│   └── blog.db          # SQLite 数据库文件（自动生成，支持 Navicat）
└── package.json         # 项目配置
```

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Clerk 账号（用于用户认证）
- OpenAI API Key（可选，用于 AI 功能）

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Clerk 认证

1. 访问 [Clerk](https://clerk.com) 注册账号
2. 创建新应用
3. 获取 `Publishable Key` 和 `Secret Key`
4. 在 `.env.local` 中配置（见下方环境变量说明）

### 3. 配置 OpenAI API（可选）

1. 访问 [OpenAI Platform](https://platform.openai.com)
2. 创建 API Key
3. 在 `.env.local` 中配置 `OPENAI_API_KEY`
4. 如果不配置，AI 功能会返回模拟结果（用于演示）

### 4. 启动开发服务器

**启动前端开发服务器（包含 API Routes）：**

```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动

**（可选）启动独立后端 API 服务器：**

如果需要使用独立的后端 API（端口 8000），可以运行：

```bash
npm run api
```

### 5. 访问应用

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

**首次使用：**
1. 点击右上角用户图标
2. 注册/登录账号
3. 登录后可以创建和编辑文章

## 📝 API 文档

### 文章 API

#### 获取文章列表
```
GET /posts
```

响应：
```json
[
  {
    "id": 1,
    "title": "文章标题",
    "content": "文章内容",
    "tags": ["标签1", "标签2"],
    "createdAt": "2025-02-01T10:00:00.000Z"
  }
]
```

#### 获取单篇文章
```
GET /posts/:id
```

#### 创建文章
```
POST /posts
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容",
  "tags": ["标签1", "标签2"]
}
```

#### 更新文章
```
PUT /posts/:id
Content-Type: application/json

{
  "title": "新标题",
  "content": "新内容",
  "tags": ["新标签"]
}
```

#### 删除文章
```
DELETE /posts/:id
```

## 🎨 功能演示

### 用户认证
1. 点击导航栏右上角的用户图标
2. 注册新账号或登录
3. 登录后才能创建/编辑文章

### 创建文章
1. **必须先登录**
2. 点击导航栏的"写文章"按钮
3. 填写标题、内容和标签
4. 点击"创建文章"

### AI 生成摘要
1. 打开任意文章详情页
2. 点击"生成摘要"按钮
3. AI 会自动分析文章内容并生成摘要
4. 展示 RAG（检索增强生成）工作流

### 编辑文章
1. 在文章详情页点击"编辑"按钮（需登录）
2. 修改内容后点击"保存更改"

### 搜索文章
1. 在博客列表页的搜索框输入关键词
2. 实时显示匹配的文章

### 标签筛选
1. 点击博客列表页的标签按钮
2. 只显示包含该标签的文章

### 深色模式
1. 点击导航栏右侧的主题切换按钮
2. 在浅色和深色模式之间切换

## 🔧 开发说明

### 环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

**必需配置：**
```env
# Clerk 认证（必需）
# 注册账号：https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**可选配置：**
```env
# OpenAI API（用于 AI 摘要功能）
# 获取 API Key：https://platform.openai.com
OPENAI_API_KEY=sk-xxxxx

# 后端 API 地址（开发环境）
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**注意：**
- 如果没有配置 `OPENAI_API_KEY`，AI 摘要功能会返回模拟结果（用于演示）
- Clerk 认证是必需的，否则无法使用创建/编辑文章功能

### 数据库

项目使用 **SQLite** 数据库，数据库文件会自动创建在 `database/blog.db`。

**特点：**
- 支持 Navicat 等数据库管理工具连接
- 数据持久化保存，重启服务器不会丢失
- 首次运行会自动创建数据库表和初始数据

**在 Navicat 中连接：**
1. 打开 Navicat → 新建连接 → SQLite
2. 数据库文件选择：`database/blog.db`
3. 连接成功后可以查看和管理数据

## 📦 构建生产版本

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 🚀 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. 在 Vercel 部署

1. 访问 [Vercel](https://vercel.com)
2. 导入 GitHub 仓库
3. 配置环境变量：
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `OPENAI_API_KEY`（可选）
4. 部署

### 3. 配置 Clerk

在 Clerk Dashboard 中配置：
- **Frontend API**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.vercel.app/api`

## 🐳 Docker 部署（可选）

```bash
# 构建镜像
docker build -t my-blog .

# 运行容器
docker run -p 3000:3000 -p 8000:8000 my-blog
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
