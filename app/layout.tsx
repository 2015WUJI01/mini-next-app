import "@/app/globals.css"
import { MainNav } from "@/components/MainNav"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: '健康饮食管理',
  description: '记录食谱和规划每日饮食',
  icons: {
    icon: [
      { url: '/favicon_io/favicon.ico' },
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16' },
    ],
    apple: [
      { url: '/favicon_io/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/favicon_io/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        rel: 'android-chrome',
        url: '/favicon_io/android-chrome-512x512.png',
        sizes: '512x512',
      },
    ],
  },
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
