'use client'

import { useState, useEffect } from 'react'

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // 从localStorage中读取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">设置</h2>
      <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
        <div>
          <h3 className="font-medium">夜间模式</h3>
          <p className="text-sm text-muted-foreground">切换深色/浅色主题</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            darkMode ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )
} 