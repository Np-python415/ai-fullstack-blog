import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          我的Next.js学习项目
        </h1>
        <div className="rounded-xl md:rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 lg:p-10">
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            这是一个为面试准备的全栈演示项目，使用 Next.js 14、TypeScript 与 Tailwind CSS 构建。
            旨在展示现代 Web 开发中的路由、样式与页面结构等基础能力，并可作为后续博客、关于等功能的入口。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium hover:opacity-90 transition-opacity text-center"
            >
              查看博客
            </Link>
            <Link
              href="/blog/new"
              className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center"
            >
              写文章
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
