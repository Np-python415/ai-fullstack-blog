export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6">
          我的Next.js学习项目
        </h1>
        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-10">
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            这是一个为面试准备的全栈演示项目，使用 Next.js 14、TypeScript 与 Tailwind CSS 构建。
            旨在展示现代 Web 开发中的路由、样式与页面结构等基础能力，并可作为后续博客、关于等功能的入口。
          </p>
        </div>
      </main>
    </div>
  );
}
