'use client'

import { useState, useEffect, useRef } from 'react'

type ProjectDifficulty = 'easy' | 'medium' | 'hard'
type SearchStatus = 'idle' | 'searching' | 'found' | 'failed'
type SearchMode = 'once' | 'infinite' | 'until-success'

interface Project {
  name: string
  description: string
}

const projectTemplates: Record<ProjectDifficulty, Project[]> = {
  easy: [
    { 
      name: '简单项目A', 
      description: '项目A描述',
    },
  ],
  medium: [],
  hard: [],
}

// 寻找过程的阶段文案
const searchPhases = [
  '正在寻找合适的项目发起人...',
  '找到发起人，正在了解项目需求...',
  '发起人项目需求评估中...',
  '进行商业论证分析...',
  '评估项目效益管理计划...',
  '准备分配项目经理...',
]

// 失败原因
const failureReasons = [
  '发起人提到的商业机会缺乏可行性',
  '项目需求评估不充分，缺乏具体细节',
  '商业论证显示投资回报率过低',
  '项目缺乏明确的经济可行性',
  '效益管理计划不完善',
  '市场环境发生重大变化',
  '发起人无法提供必要的项目资源',
  '项目范围定义不清晰',
  '风险评估显示项目风险过高',
  '发起人缺乏项目管理经验',
  '项目时间线不切实际',
  '预算评估不合理',
  '技术方案不可行',
  '团队组建困难',
  '项目目标不明确',
]

export default function ProjectStart() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle')
  const [searchProgress, setSearchProgress] = useState(0)
  const [searchTime, setSearchTime] = useState(0)
  const [showSearchOptions, setShowSearchOptions] = useState(false)
  const [searchMode, setSearchMode] = useState<SearchMode>('once')
  const [foundProjects, setFoundProjects] = useState<Project[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [failureReason, setFailureReason] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowSearchOptions(false)
      }
    }

    if (showSearchOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearchOptions])

  const handleProjectSearch = (mode: SearchMode) => {
    setSearchMode(mode)
    setShowSearchOptions(false)
    setIsSearching(true)
    setSearchStatus('searching')
    setSearchProgress(0)
    setSearchTime(0)
    setCurrentPhase(0)
    setFailureReason('')
    
    const searchProject = () => {
      let startTime: number | null = null
      const duration = 10000 // 10秒完成搜索
      const targetProgress = 100
      const phaseDuration = duration / searchPhases.length

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const elapsed = currentTime - startTime
        const progress = Math.min((elapsed / duration) * targetProgress, targetProgress)
        
        setSearchProgress(progress)
        setSearchTime(Math.floor(elapsed / 1000))

        // 更新当前阶段
        const currentPhaseIndex = Math.min(
          Math.floor(elapsed / phaseDuration),
          searchPhases.length - 1
        )
        setCurrentPhase(currentPhaseIndex)

        if (progress < targetProgress) {
          requestAnimationFrame(animate)
        } else {
          // 搜索完成，30%概率成功
          const isSuccess = Math.random() < 0.3
          if (isSuccess) {
            const allProjects = [
              ...projectTemplates.easy,
              ...projectTemplates.medium,
              ...projectTemplates.hard
            ]
            const randomProject = allProjects[Math.floor(Math.random() * allProjects.length)]
            setFoundProjects(prev => [...prev, randomProject])
            setSearchStatus('found')
            if (mode === 'once') {
              setIsSearching(false)
            } else if (mode === 'until-success') {
              setIsSearching(false)
            }
          } else {
            // 随机选择一个失败原因
            const randomReason = failureReasons[Math.floor(Math.random() * failureReasons.length)]
            setFailureReason(randomReason)
            setSearchStatus('failed')
            if (mode === 'infinite' || mode === 'until-success') {
              // 继续搜索
              setTimeout(() => {
                setSearchStatus('searching')
                setSearchProgress(0)
                setSearchTime(0)
                setCurrentPhase(0)
                setFailureReason('')
                requestAnimationFrame(animate)
              }, 1000)
            } else {
              setIsSearching(false)
            }
          }
        }
      }

      requestAnimationFrame(animate)
    }

    searchProject()
  }

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    // TODO: 处理项目选择逻辑
    console.log('选择的项目:', project)
  }

  const getDifficultyColor = (difficulty: ProjectDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'hard':
        return 'text-red-500'
    }
  }

  const getDifficultyText = (difficulty: ProjectDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return '简单'
      case 'medium':
        return '中级'
      case 'hard':
        return '高级'
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-8 text-center">寻找项目机会</h2>
      
      <div className="space-y-6">
        {/* 寻找项目卡片 */}
        <div 
          className="relative bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors cursor-pointer group"
          onClick={() => !isSearching && setShowSearchOptions(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">寻找项目</h3>
              <p className="text-sm text-muted-foreground">点击开始寻找项目机会</p>
            </div>
          </div>
          
          {/* 悬浮提示 */}
          <div className="absolute inset-0 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="text-center text-white p-4">
              <div className="text-lg font-medium mb-2">项目寻找信息</div>
              <div className="text-sm">每次寻找耗时：10秒</div>
              <div className="text-sm">当前成功率：30%</div>
            </div>
          </div>

          {/* 搜索选项弹窗 */}
          {showSearchOptions && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowSearchOptions(false)}
            >
              <div 
                ref={modalRef}
                className="bg-background p-6 rounded-lg w-64 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowSearchOptions(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
                <h4 className="text-lg font-medium mb-4">选择寻找模式</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowSearchOptions(false)
                      handleProjectSearch('once')
                    }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    寻找一次
                  </button>
                  <button
                    onClick={() => {
                      setShowSearchOptions(false)
                      handleProjectSearch('infinite')
                    }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    无限寻找
                  </button>
                  <button
                    onClick={() => {
                      setShowSearchOptions(false)
                      handleProjectSearch('until-success')
                    }}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    直到成功
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索进度 */}
        {searchStatus === 'searching' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-lg">{searchPhases[currentPhase]}</div>
              <div className="text-sm text-muted-foreground">
                已搜索 {searchTime} 秒 / 10秒
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${searchProgress}%`,
                  transition: 'width 16ms linear'
                }}
              />
            </div>
          </div>
        )}

        {/* 搜索失败提示 */}
        {searchStatus === 'failed' && (
          <div className="text-center space-y-2">
            <div className="text-red-500 font-medium">项目评估失败</div>
            <div className="text-muted-foreground">{failureReason}</div>
          </div>
        )}

        {/* 找到的项目列表 */}
        {foundProjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">已找到的项目</h3>
            {foundProjects.map((project, index) => (
              <div key={index} className="p-6 bg-card rounded-lg border border-border">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-xl">{project.name}</h4>
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex justify-end">
                  <button 
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    onClick={() => handleProjectSelect(project)}
                  >
                    接受委任
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 