/**
 * 博客 API 基础地址：从环境变量读取，未定义时回退到开发环境 localhost。
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const POSTS_API_URL = `${API_BASE_URL}/posts`;

/**
 * Post 接口定义
 */
export interface Post {
  id: number | string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  created_at?: string;
}

/**
 * 创建文章
 */
export async function createPost(post: Omit<Post, "id" | "createdAt" | "created_at">): Promise<Post> {
  try {
    const res = await fetch(POSTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      throw new Error(`创建文章失败: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`无法连接到后端API (${POSTS_API_URL})，请确保后端服务器已启动。运行命令: npm run api 或 node server/index.js`);
    }
    throw error;
  }
}

/**
 * 更新文章
 */
export async function updatePost(id: string | number, post: Partial<Post>): Promise<Post> {
  try {
    const res = await fetch(`${POSTS_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      throw new Error(`更新文章失败: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `无法连接到后端API (${POSTS_API_URL})，请确保后端服务器已启动：npm run api`
      );
    }
    throw error;
  }
}

/**
 * 删除文章
 */
export async function deletePost(id: string | number): Promise<void> {
  try {
    const res = await fetch(`${POSTS_API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`删除文章失败: ${res.status} ${res.statusText}`);
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `无法连接到后端API (${POSTS_API_URL})，请确保后端服务器已启动：npm run api`
      );
    }
    throw error;
  }
}

/**
 * 获取文章列表
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(POSTS_API_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`获取文章列表失败: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("API 返回数据格式不正确");
    }
    return data as Post[];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `无法连接到后端API (${POSTS_API_URL})，请确保后端服务器已启动：npm run api`
      );
    }
    throw error;
  }
}

/**
 * 获取单篇文章
 */
export async function getPost(id: string | number): Promise<Post | null> {
  const numericId = String(id);

  // 优先尝试直接按 ID 获取
  try {
    const res = await fetch(`${POSTS_API_URL}/${numericId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = (await res.json()) as Post;
      return data;
    }
  } catch {
    // 忽略，下面会走列表回退方案
  }

  // 回退方案：从列表里查一篇（/posts 正常时，这个一定能用）
  try {
    const posts = await getPosts();
    const found = posts.find((p) => String(p.id) === numericId) ?? null;
    return found ?? null;
  } catch {
    return null;
  }
}
