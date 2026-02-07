import Link from "next/link";

import { POSTS_API_URL } from "@/app/lib/api";

export interface Post {
  id: number | string;
  title: string;
  content: string;
  createdAt?: string;
  created_at?: string;
}

function formatDate(post: Post): string {
  const raw = post.createdAt ?? post.created_at ?? "";
  if (!raw) return "";
  try {
    const d = new Date(raw);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}年${m}月${day}日`;
  } catch {
    return String(raw);
  }
}

function getSummary(content: string, maxLength = 100): string {
  const text = (content ?? "").trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(POSTS_API_URL, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`获取文章列表失败: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("API 返回数据格式不正确");
  }
  return data as Post[];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-10">
          博客列表
        </h1>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-500 dark:text-slate-400">
            暂无文章
          </div>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li
                key={String(post.id)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {post.title || "无标题"}
                </h2>
                <time
                  className="text-sm text-slate-500 dark:text-slate-400"
                  dateTime={post.createdAt ?? post.created_at ?? undefined}
                >
                  {formatDate(post)}
                </time>
                <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {getSummary(post.content, 100)}
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block mt-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  阅读全文 →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
