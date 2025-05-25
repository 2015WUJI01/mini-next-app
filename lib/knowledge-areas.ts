import { Document,documentMap } from './document';

export interface ProcessGroupTimelineType {
  id: string;
  name: string;
}
export const processGroupTimelineTypeMap: Record<string, ProcessGroupTimelineType> = {
  '启动': {
    id: 'initiation',
    name: '启动'
  },
  '规划': {
    id: 'planning',
    name: '规划'
  },
  '执行': {
    id: 'execution',
    name: '执行'
  },
  '监控': {
    id: 'monitoring',
    name: '监控'
  },
  '收尾': {
    id: 'closing',
    name: '收尾'
  }
}

export interface KnowledgeArea {
  id: string;
  name: string;
}

export const knowledgeAreaMap: Record<string, KnowledgeArea> = {
  '整合管理': {
    id: 'integration_management',
    name: '整合管理',
  },
  '范围管理': {
    id: 'scope_management',
    name: '范围管理',
  },
  '进度管理': {
    id: 'schedule_management',
    name: '进度管理',
  },
  '成本管理': {
    id: 'cost_management',
    name: '成本管理',
  },
  '质量管理': {
    id: 'quality_management',
    name: '质量管理',
  },
  '资源管理': {
    id: 'resource_management',
    name: '资源管理',
  },
  '沟通管理': {
    id: 'communication_management',
    name: '沟通管理',
  },
  '风险管理': {
    id: 'risk_management',
    name: '风险管理',
  },  
  '采购管理': {
    id: 'procurement_management',
    name: '采购管理',
  },
  '相关方管理': {
    id: 'stakeholder_management', 
    name: '相关方管理',
  }
}

export const knowledgeAreas: KnowledgeArea[] = [
  {
    id: 'integration_management',
    name: '整合管理',
  },
  {
    id: 'scope_management',
    name: '范围管理'
  },
  {
    id: 'schedule_management',
    name: '进度管理'
  },
  {
    id: 'cost_management',
    name: '成本管理'
  },
  {
    id: 'quality_management',
    name: '质量管理'
  },
  {
    id: 'resource_management',
    name: '资源管理'
  },
  {
    id: 'communication_management',
    name: '沟通管理'
  },
  {
    id: 'risk_management',
    name: '风险管理'
  },
  {
    id: 'procurement_management',
    name: '采购管理'
  },
  {
    id: 'stakeholder_management',
    name: '相关方管理'
  }
];

export interface ProcessGroup {
  id: string;
  name: string;
  processGroupTimelineType?: ProcessGroupTimelineType;
  knowledgeArea?: KnowledgeArea;
  inputs?: Document[];
  outputs?: Document[];
}
export const processGroups: ProcessGroup[] = [
  {
    id: '4.1',
    name: '制定项目章程',
    processGroupTimelineType: processGroupTimelineTypeMap['启动'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
    inputs: (()=> {
      const names = ['商业论证', '协议', '事业环境因素', '组织过程资产'];
      return names.map(name => {
        return documentMap[name] || { id: name, name: `${name}*` };
      });
    })(),
    outputs: (()=> {
      const names = ['项目章程','假设日志'];
      return names.map(name => {
        return documentMap[name] || { id: name, name: `${name}*` };
      });
    })(),
  },
  {
    id: '4.2',
    name: '制定项目管理计划',
    processGroupTimelineType: processGroupTimelineTypeMap['规划'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  },
  {
    id: '4.3',
    name: '指导与管理项目工作',
    processGroupTimelineType: processGroupTimelineTypeMap['执行'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  },
  {
    id: '4.4',
    name: '管理项目知识',
    processGroupTimelineType: processGroupTimelineTypeMap['执行'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  },
  {
    id: '4.5',
    name: '监控项目工作',
    processGroupTimelineType: processGroupTimelineTypeMap['监控'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  },
  {
    id: '4.6',
    name: '实施整体变更控制',
    processGroupTimelineType: processGroupTimelineTypeMap['监控'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  },
  {
    id: '4.7',
    name: '结束项目或阶段',
    processGroupTimelineType: processGroupTimelineTypeMap['收尾'],
    knowledgeArea: knowledgeAreaMap['整合管理'],
  }
]
