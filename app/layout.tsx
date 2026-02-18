import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeToggle } from "./components/theme-toggle";
import { ClerkProvider } from "@clerk/nextjs";
import { UserButtonComponent } from "./components/user-button";

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
    <ClerkProvider>
      <html lang="zh-CN">
        <body className="antialiased min-h-screen flex flex-col">
          <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <nav className="h-full max-w-4xl mx-auto px-4 md:px-6 flex items-center justify-between">
              <Link
                href="/"
                className="text-lg font-semibold text-slate-800 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                我的项目
              </Link>
              <div className="flex items-center gap-4 md:gap-8">
                <ul className="flex items-center gap-4 md:gap-8">
                  <li>
                    <Link
                      href="/"
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors text-sm md:text-base"
                    >
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors text-sm md:text-base"
                    >
                      博客
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog/new"
                      className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors text-sm md:text-base"
                    >
                      写文章
                    </Link>
                  </li>
                </ul>
                <div className="flex items-center gap-3">
                  <UserButtonComponent />
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </header>
          <div className="flex-1 pt-14">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
