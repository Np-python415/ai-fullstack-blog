import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm text-center">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          文章不存在
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
          未找到该文章，可能已被删除或链接有误。
        </p>
        <Link
          href="/blog"
          className="inline-block px-4 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity"
        >
          返回博客列表
        </Link>
      </div>
    </div>
  );
}
