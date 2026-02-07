export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-10" />
        <ul className="space-y-4">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
            >
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
