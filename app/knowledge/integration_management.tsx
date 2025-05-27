'use client'

import { useState } from 'react'

const processGroups = [
  { id: 'initiation', name: '启动' },
  { id: 'planning', name: '规划' },
  { id: 'execution', name: '执行' },
  { id: 'monitoring', name: '监控' },
  { id: 'closing', name: '收尾' },
]

// 步骤（过程组）数据
const steps = [
  {
    title: '点燃炼金炉',
    desc: '制定项目章程，启动项目。',
    group: 'initiation',
    inputs: ['商业论证', '协议', '环境因素', '组织资产'],
    outputs: ['项目章程', '假设日志'],
  },
  {
    title: '配置配方',
    desc: '制定项目管理计划，规划全局。',
    group: 'planning',
    inputs: ['项目章程', '假设日志'],
    outputs: ['项目管理计划'],
  },
  {
    title: '投料搅拌',
    desc: '指导与管理项目工作，推进进展。',
    group: 'execution',
    inputs: ['项目管理计划'],
    outputs: ['工作绩效数据', '工作绩效数据'],
  },
  {
    title: '知识结晶',
    desc: '管理项目知识，沉淀经验。',
    group: 'execution',
    inputs: ['工作绩效数据'],
    outputs: ['知识库'],
  },
  {
    title: '观察反应',
    desc: '监控项目工作，发现偏差。',
    group: 'monitoring',
    inputs: ['工作绩效数据'],
    outputs: ['监控报告'],
  },
  {
    title: '调整配方',
    desc: '实施整体变更控制，灵活应对。',
    group: 'monitoring',
    inputs: ['监控报告'],
    outputs: ['变更日志'],
  },
  {
    title: '收获成果',
    desc: '结束项目或阶段，收获成果。',
    group: 'closing',
    inputs: ['变更日志'],
    outputs: ['项目总结'],
  },
]

// 初始道具栏
const initialItems: Record<string, number> = {
  '商业论证': 1,
  '协议': 1,
  '环境因素': 1,
  '组织资产': 1,
}

export default function IntegrationManagement() {
  const [items, setItems] = useState<Record<string, number>>(initialItems)
  const [message, setMessage] = useState<string>('')
  const [activeGroup, setActiveGroup] = useState('initiation')

  // 检查是否拥有所有输入道具
  const canStart = (inputs: string[]) => inputs.every(i => items[i] && items[i] > 0)

  // 启动步骤：消耗输入，获得输出
  const handleStart = (stepIdx: number) => {
    const step = steps[stepIdx]
    if (!canStart(step.inputs)) {
      const lack = step.inputs.filter(i => !items[i] || items[i] <= 0)
      setMessage(`缺少道具：${lack.join('、')}`)
      return
    }
    // 消耗输入
    const newItems = { ...items }
    step.inputs.forEach(i => { newItems[i] -= 1 })
    // 获得输出
    step.outputs.forEach(o => { newItems[o] = (newItems[o] || 0) + 1 })
    setItems(newItems)
    setMessage(`成功完成「${step.title}」，获得：${step.outputs.join('、')}`)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">整合管理（融炼⚗️）</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">装备道具栏</h3>
        <div className="flex flex-wrap gap-4 bg-accent/50 p-4 rounded">
          {Object.entries(items).filter(([_, n]) => n > 0).length === 0 && <span className="text-muted-foreground">暂无道具</span>}
          {Object.entries(items).filter(([_, n]) => n > 0).map(([name, num]) => (
            <div key={name} className="flex items-center gap-1 px-2 py-1 bg-card rounded shadow text-sm">
              <span className="font-bold">{name}</span>
              <span className="text-xs text-muted-foreground">x{num}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 过程组Tab菜单 */}
      <div className="flex gap-2 mb-4">
        {processGroups.map(g => (
          <button
            key={g.id}
            className={`px-4 py-2 rounded font-medium transition-colors ${activeGroup === g.id ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground hover:bg-primary/10'}`}
            onClick={() => setActiveGroup(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>
      <h3 className="text-xl font-semibold mb-2">{processGroups.find(g => g.id === activeGroup)?.name}过程</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.filter(s => s.group === activeGroup).map((step, idx) => (
          <div key={step.title} className="bg-card rounded shadow p-4 flex flex-col gap-2">
            <div className="font-bold text-lg">{step.title}</div>
            <div className="text-sm text-muted-foreground mb-1">{step.desc}</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-medium">需要：</span>
              {step.inputs.map(i => (
                <span key={i} className={`px-2 py-0.5 rounded ${items[i] > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-medium">产出：</span>
              {step.outputs.map(o => (
                <span key={o} className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{o}</span>
              ))}
            </div>
            <button
              className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={() => handleStart(steps.findIndex(s => s === step))}
              disabled={!canStart(step.inputs)}
            >
              启动
            </button>
          </div>
        ))}
      </div>
      {message && <div className="mt-6 p-3 bg-yellow-50 text-yellow-800 rounded shadow">{message}</div>}
    </div>
  )
} 