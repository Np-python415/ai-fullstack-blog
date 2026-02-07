import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js App",
  description: "Created with Next.js 14, TypeScript and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <nav className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-semibold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              我的项目
            </Link>
            <ul className="flex items-center gap-8">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors"
                >
                  博客
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div className="flex-1 pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
