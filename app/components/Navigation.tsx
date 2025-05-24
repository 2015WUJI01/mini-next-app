'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [currentView, setCurrentView] = useState('knowledge')

  const navigationItems = [
    { id: 'knowledge', label: '知识' },
    { id: 'saves', label: '存档' },
    { id: 'settings', label: '设置' }
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'project-start':
        return <div>项目启动</div>
      case 'knowledge':
        return <div>知识 内容区域</div>
      case 'saves':
        return <div>存档内容区域</div>
      case 'settings':
        return <div>设置内容区域</div>
      default:
        return <div>项目启动</div>
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
              className={`block w-full text-left px-4 py-2 rounded hover:bg-accent text-secondary-foreground transition-colors ${
                currentView === item.id ? 'bg-accent' : ''
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