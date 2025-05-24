export interface Document {
  id: string;
  name: string;
  description?: string;
}

export const DOCUMENTS: Document[] = [
  {
    id: 'project_management_plan',
    name: '项目管理计划',
    description: '描述如何执行、监控和控制项目的文件'
  },
  // ... 其他文档数据
]; 