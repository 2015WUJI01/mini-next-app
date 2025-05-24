'use client'

import { useState, useEffect } from 'react'
import { processGroups } from '../../lib/knowledge-areas'
import { documentMap } from '../../lib/document'
import { Badge } from "@/components/ui/badge"

export default function IntegrationManagement() {
  const getInputs = (processGroup: any) => {
    const inputs = typeof processGroup.inputs === 'function' 
      ? processGroup.inputs() 
      : processGroup.inputs
    
    return Array.isArray(inputs) ? inputs : []
  }

  const getOutputs = (processGroup: any) => {
    const outputs = typeof processGroup.outputs === 'function' 
      ? processGroup.outputs() 
      : processGroup.outputs
    
    return Array.isArray(outputs) ? outputs : []
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">项目整合管理</h2>
      <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
        <div className="flex flex-col gap-2">
          {processGroups.filter(processGroup => processGroup.knowledgeArea?.name === '整合管理').map((processGroup) => (
            <div key={processGroup.id} className="p-4 bg-card rounded-lg shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold">{processGroup.name}</h3>
                <Badge variant="secondary">
                  {processGroup.processGroupTimelineType?.name}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {getInputs(processGroup).map((input) => (
                  <Badge key={input.id} variant="outline">
                    {input.name}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {getOutputs(processGroup).map((output) => (
                  <Badge key={output.id} variant="outline">
                    {output.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 