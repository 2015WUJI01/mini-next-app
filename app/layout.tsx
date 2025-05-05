import "@/app/globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <header className="border-b">
          <div className="container mx-auto py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              健康饮食管理
            </Link>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/recipes">食谱记录</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/meal-planning">饮食编排</Link>
              </Button>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
