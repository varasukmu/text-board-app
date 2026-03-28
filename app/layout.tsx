import './globals.css' // ต้องมีบรรทัดนี้!

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen selection:bg-blue-200">
        <main className="max-w-4xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  )
}