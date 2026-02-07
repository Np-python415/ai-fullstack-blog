"use client";

import Link from "next/link";
import { useEffect } from "react";

import { POSTS_API_URL } from "@/app/lib/api";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("BlogError:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-800 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          加载失败
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
          {error.message || `获取博客列表时发生错误，请确认 API 已启动：${POSTS_API_URL}`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
          >
            重试
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
