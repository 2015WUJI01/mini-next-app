import "@/app/globals.css"
import { MainNav } from "@/components/MainNav"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: '健康饮食管理',
  description: '记录食谱和规划每日饮食',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="no-scrollbar">
      <body className="min-h-screen bg-background font-sans antialiased no-scrollbar">
        <div className="flex flex-col w-full min-h-screen">
          <header className="border-b w-full">
            <MainNav />
          </header>
          <main className="flex-1 w-full flex flex-col">
            <div className="container py-8 px-4 mx-auto max-w-5xl">
              {children}
            </div>
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  )
}
