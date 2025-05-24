export interface Document {
  id: string;
  name: string;
  description?: string;
}

export const documents: Document[] = [
  // {
  //   id: 'project_management_plan',
  //   name: '项目管理计划',
  //   description: '描述如何执行、监控和控制项目的文件'
  // },
  // ... 其他文档数据
];

export const documentMap: Record<string, Document> = {
  '商业论证': {
    id: 'business_case',
    name: '商业论证',
    description: ''
  },
  '协议': {
    id: 'agreement',
    name: '协议',
    description: ''
  },
  '事业环境因素': {
    id: 'organizational_environmental_factors',
    name: '事业环境因素',
    description: ''
  },
  '组织过程资产': {
    id: 'organizational_process_assets',
    name: '组织过程资产',
    description: ''
  },
  '项目管理计划': {
    id: 'project_management_plan',
    name: '项目管理计划',
    description: ''
  },
  '项目章程': {
    id: 'project_charter',
    name: '项目章程',
    description: ''
  },
  '假设日志': {
    id: 'assumption_log',
    name: '假设日志',
    description: ''
  },

}