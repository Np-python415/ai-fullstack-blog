import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4 md:px-6">
      <div className="max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 md:p-8 shadow-sm text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          文章不存在
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
          未找到该文章，可能已被删除或链接有误。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/blog"
            className="inline-block px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
          >
            返回博客列表
          </Link>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
