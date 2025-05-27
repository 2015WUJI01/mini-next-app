'use client'

// import type { Metadata } from 'next'
import './globals.css'
import React, { useMemo, useState, useEffect } from 'react'
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
  const [collapsed, setCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  useEffect(() => { setIsClient(true) }, [])

  // 使用 useMemo 缓存导航项，避免不必要的重新计算
  const navigationItems = useMemo<NavigationItem[]>(() => [
    { id: 'project-start', label: '项目启动', href: '/project-start' },
    // { id: 'knowledge', label: '知识', href: '/knowledge' },
    ...knowledgeAreas.map(area => ({
      id: area.id,
      label: area.name,
      href: `/knowledge/${area.id}`,
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
          {isClient && (
            <aside className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'} bg-secondary flex flex-col border-r border-border`}>
              <div className="p-6 flex items-center justify-between">
                <div className={`${collapsed ? 'hidden' : ''}`}>
                  <h1 className="text-2xl font-bold">PMP Sim Idle</h1>
                  <p className="text-sm mt-2 opacity-90">Project Management Simulation Idle Game</p>
                </div>
                <button
                  className="ml-auto p-2 rounded hover:bg-accent transition-colors"
                  onClick={() => setCollapsed(v => !v)}
                  aria-label={collapsed ? '展开导航栏' : '收起导航栏'}
                >
                  {collapsed ? '➡️' : '⬅️'}
                </button>
              </div>
              {/* 货币栏 */}
              {!collapsed && (
                <>
                  <div className="flex justify-center items-center gap-6 px-4 pb-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xl">👥</span>
                      <span className="text-sm font-medium mt-1">人力</span>
                      <span className="text-base font-bold text-primary">100</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl">⚠️</span>
                      <span className="text-sm font-medium mt-1">风险点</span>
                      <span className="text-base font-bold text-yellow-500">5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl">📈</span>
                      <span className="text-sm font-medium mt-1">管理点</span>
                      <span className="text-base font-bold text-green-600">20</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center pb-4">
                    <span className="text-base font-medium text-muted-foreground">当前项目：</span>
                    <span className="text-base font-bold text-primary ml-1">示例项目</span>
                  </div>
                </>
              )}
              <nav className={`flex-1 p-4 space-y-2 ${collapsed ? 'p-2' : 'p-4'}`}> 
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch={true}
                    className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground font-medium' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    } flex items-center gap-2`}
                  >
                    {/* 图标或首字母（可自定义） */}
                    {collapsed && (
                      <span className="text-base font-bold whitespace-nowrap">
                        {/* 提取前两个中文汉字，如果没有则用原逻辑 */}
                        {(() => {
                          const match = item.label.match(/^[\u4e00-\u9fa5]{2}/);
                          if (match) return match[0];
                          // 否则尝试提取括号内内容的首字
                          return item.label.match(/[(（][^()（）]+[)）]/)?.[0]?.replace(/[()（）]/g, '')?.[0] || item.label[0];
                        })()}
                      </span>
                    )}
                    {/* 展开时显示完整文字和进度 */}
                    {!collapsed && (
                      <div className="flex flex-col gap-0.5 flex-1">
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
                    )}
                  </Link>
                ))}
              </nav>
            </aside>
          )}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}