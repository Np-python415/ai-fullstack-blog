/**
 * 博客 API 基础地址：从环境变量读取，未定义时回退到开发环境 localhost。
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const POSTS_API_URL = `${API_BASE_URL}/posts`;
