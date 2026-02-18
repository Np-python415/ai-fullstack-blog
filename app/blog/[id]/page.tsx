"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getPost, deletePost, type Post } from "@/app/lib/api";

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

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(id);
        if (!data) {
          router.push("/blog");
          return;
        }
        setPost(data);
      } catch (err) {
        router.push("/blog");
      } finally {
        setIsLoading(false);
      }
    }
    loadPost();
  }, [id, router]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(id);
      router.push("/blog");
      router.refresh();
    } catch (err) {
      alert("删除失败，请重试");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!post) return;
    setIsGeneratingSummary(true);
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
        }),
      });
      const data = await response.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        alert(data.error || "生成摘要失败");
      }
    } catch (error) {
      alert("生成摘要失败，请重试");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <main className="max-w-3xl mx-auto px-4 md:px-6 py-12">
          <div className="text-center text-slate-600 dark:text-slate-400">加载中...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium mb-8"
        >
          ← 返回博客列表
        </Link>
        <article className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {post.title || "无标题"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <time
                  className="text-sm text-slate-500 dark:text-slate-400"
                  dateTime={post.createdAt ?? post.created_at ?? undefined}
                >
                  {getCreatedAt(post)}
                </time>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/blog/${id}/edit`}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm"
              >
                编辑
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-lg bg-red-600 dark:bg-red-700 text-white font-medium hover:opacity-90 transition-opacity text-sm"
              >
                删除
              </button>
            </div>
          </div>

          {showDeleteConfirm && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                确定要删除这篇文章吗？此操作无法撤销。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 dark:bg-red-700 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
                >
                  {isDeleting ? "删除中..." : "确认删除"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* AI 摘要生成 */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  AI 智能摘要
                </h3>
                {aiSummary ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {aiSummary}
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    点击按钮，让 AI 为你生成文章摘要
                  </p>
                )}
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-sm whitespace-nowrap"
              >
                {isGeneratingSummary ? "生成中..." : aiSummary ? "重新生成" : "生成摘要"}
              </button>
            </div>
          </div>

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
