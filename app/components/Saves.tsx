'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SaveData } from '@/types/save'
import { useToast } from '@/hooks/use-toast'

export default function Saves() {
  const [saveData, setSaveData] = useState<string>('{"example": "存档数据"}') // 这里后续可以替换为实际的存档数据
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(saveData)
      toast({
        title: "复制成功",
        description: "存档数据已复制到剪贴板",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "请重试",
      })
    }
  }

  const handleExport = () => {
    const blob = new Blob([saveData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pmp-sim-save-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "导出成功",
      description: "存档文件已导出",
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">存档管理</h2>
      
      <div className="space-y-2">
        <Textarea
          value={saveData}
          readOnly
          className="min-h-[400px] font-mono text-sm"
        />
        
        <div className="flex gap-4">
          <Button onClick={handleCopy}>
            复制存档
          </Button>
          <Button onClick={handleExport}>
            导出存档
          </Button>
        </div>
      </div>
    </div>
  )
} 