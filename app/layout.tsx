import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen selection:bg-blue-200 dark:selection:bg-blue-900 transition-colors duration-300">
        <main className="max-w-4xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  )
}