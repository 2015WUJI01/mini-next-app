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
    { id: 'knowledge', label: '知识' },
    ...knowledgeAreas.map(area => ({
      id: area.id,
      label: area.name
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
              {item.label}
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