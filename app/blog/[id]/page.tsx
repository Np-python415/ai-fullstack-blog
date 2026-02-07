import Link from "next/link";
import { notFound } from "next/navigation";

import { POSTS_API_URL } from "@/app/lib/api";

export interface Post {
  id: number | string;
  title: string;
  content: string;
  createdAt?: string;
  created_at?: string;
}

function getCreatedAt(post: Post): string {
  const raw = post.createdAt ?? post.created_at ?? "";
  if (!raw) return "";
  try {
    const d = new Date(raw);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return String(raw);
  }
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`${POSTS_API_URL}/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as Post;
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium mb-8"
        >
          ← 返回博客列表
        </Link>
        <article className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {post.title || "无标题"}
          </h1>
          <time
            className="text-sm text-slate-500 dark:text-slate-400"
            dateTime={post.createdAt ?? post.created_at ?? undefined}
          >
            {getCreatedAt(post)}
          </time>
          <div className="mt-6 prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {post.content || ""}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
