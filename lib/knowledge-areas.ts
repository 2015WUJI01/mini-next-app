import { Document } from './document';

export interface KnowledgeArea {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
}

export const KNOWLEDGE_AREAS: KnowledgeArea[] = [
  {
    id: 'integration_management',
    name: '整合管理',
    inputs: ['project_management_plan', 'project_documents', 'approved_change_requests', 'enterprise_environmental_factors', 'organizational_process_assets'],
    outputs: ['deliverables', 'work_performance_data', 'issue_log', 'change_requests', 'project_management_plan_updates', 'project_documents_updates']
  },
  // ... 其他知识领域数据
]; 