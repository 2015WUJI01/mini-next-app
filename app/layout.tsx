'use client'

// import type { Metadata } from 'next'
import './globals.css'
import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { knowledgeAreas } from '../lib/knowledge-areas'

interface NavigationItem {
  id: string
  label: string
  href: string
  progress?: boolean
  progressValue?: number
  level?: number
}

// export const metadata: Metadata = {
//   title: 'PMP Sim Idle',
//   description: 'PMP Sim Idle - A unique idle game that helps you learn project management knowledge through engaging gameplay. Enhance your project management skills by managing virtual projects, allocating resources, and making strategic decisions.'
// }

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 使用 useMemo 缓存导航项，避免不必要的重新计算
  const navigationItems = useMemo<NavigationItem[]>(() => [
    { id: 'project-start', label: '项目启动', href: '/project-start' },
    { id: 'knowledge', label: '知识', href: '/knowledge' },
    ...knowledgeAreas.map(area => ({
      id: area.id,
      label: area.name,
      href: `/${area.id}`,
      progress: true,
      progressValue: 0,
      level: 1,
    })),
    { id: 'saves', label: '存档', href: '/saves' },
    { id: 'settings', label: '设置', href: '/settings' },
  ], [])

  return (
    <html lang="zh" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-secondary flex flex-col border-r border-border">
            <div className="p-6">
              <h1 className="text-2xl font-bold">PMP Sim Idle</h1>
              <p className="text-sm mt-2 opacity-90">Project Management Simulation Idle Game</p>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <div className="flex items-center gap-2">
                        {item?.progress && (
                          <span className="text-xs text-muted-foreground">{item.progressValue}%</span>
                        )}
                        {item?.level && (
                          <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                            Lv.{item.level}
                          </span>
                        )}
                      </div>
                    </div>
                    {item?.progress && (
                      <div className="w-full">
                        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${item.progressValue}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </nav>
          </aside>
          
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}