'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import IntegrationManagement from './IntegrationManagement'
import Settings from './Settings'
import Saves from './Saves'
import { knowledgeAreas } from '../../lib/knowledge-areas'

export default function Navigation() {
  const [currentView, setCurrentView] = useState('knowledge')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    { id: 'project-start', label: '项目启动' },
    { id: 'knowledge', label: '知识' },
    ...knowledgeAreas.map(area => ({
      id: area.id,
      label: area.name,
      progress: true,
      progressValue: 0,
      level: 1,
    })),
    { id: 'saves', label: '存档' },
    { id: 'settings', label: '设置' },
  ]

  const renderContent = () => {
    if (!mounted) return null

    switch (currentView) {
      case 'project-start':
        return <div>项目启动</div>
      case 'integration_management':
        return <IntegrationManagement />
      case 'knowledge':
        return <div>知识 内容区域</div>
      case 'saves':
        return <Saves />
      case 'settings':
        return <Settings />
      default:
        return <div>{currentView}</div>
    }
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-secondary flex flex-col border-r border-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold">PMP Sim Idle</h1>
          <p className="text-sm mt-2 opacity-90">Project Management Simulation Idle Game</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`block w-full text-left px-4 py-2 rounded transition-colors ${
                currentView === item.id 
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
            </button>
          ))}
        </nav>
      </aside>
      
      <main className="flex-1 p-8">
        {renderContent()}
      </main>
    </div>
  )
} 