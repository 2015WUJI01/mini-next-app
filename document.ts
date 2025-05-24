export interface Document {
  id: string;
  name: string;
  description: string;
  category: 'plan' | 'report' | 'register' | 'baseline' | 'other';
  isUpdateable: boolean;
}

export const DOCUMENTS: Document[] = [
  {
    id: 'project_charter',
    name: '项目章程',
    description: '正式批准项目并授权项目经理使用组织资源的文件',
    category: 'plan',
    isUpdateable: false
  },
  {
    id: 'project_management_plan',
    name: '项目管理计划',
    description: '描述如何执行、监控和控制项目的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'scope_management_plan',
    name: '范围管理计划',
    description: '描述如何定义、开发、监督、控制和验证项目范围的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'requirements_management_plan',
    name: '需求管理计划',
    description: '描述如何分析、记录和管理需求的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'requirements_document',
    name: '需求文件',
    description: '记录项目需求的文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'requirements_tracking_matrix',
    name: '需求跟踪矩阵',
    description: '将需求与项目目标和其他需求关联起来的表格',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_scope_statement',
    name: '项目范围说明书',
    description: '对项目范围、主要可交付成果、假设条件和制约因素的描述',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'scope_baseline',
    name: '范围基准',
    description: '项目范围说明书、WBS和WBS词典的集合',
    category: 'baseline',
    isUpdateable: true
  },
  {
    id: 'work_performance_data',
    name: '工作绩效数据',
    description: '在执行项目工作的过程中，从每个正在执行的活动中收集到的原始观察结果和测量值',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'work_performance_reports',
    name: '工作绩效报告',
    description: '为制定决策、采取行动或引起关注，而汇编工作绩效信息所形成的实物或电子项目文件',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'change_requests',
    name: '变更请求',
    description: '关于修改任何文件、可交付成果或基准的正式提议',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_documents',
    name: '项目文件',
    description: '项目过程中产生的各种文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_documents_updates',
    name: '项目文件更新',
    description: '对项目文件的更新',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_management_plan_updates',
    name: '项目管理计划更新',
    description: '对项目管理计划的更新',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'deliverables',
    name: '可交付成果',
    description: '为完成某一过程、阶段或项目而必须产出的任何独特并可核实的产品、成果或服务能力',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'accepted_deliverables',
    name: '验收的可交付成果',
    description: '项目发起人或客户正式签字批准并确认已满足验收标准的项目可交付成果',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'issue_log',
    name: '问题日志',
    description: '记录项目问题的文件',
    category: 'register',
    isUpdateable: true
  },
  {
    id: 'lessons_learned_register',
    name: '经验教训登记册',
    description: '记录项目经验教训的文件',
    category: 'register',
    isUpdateable: true
  },
  {
    id: 'assumption_log',
    name: '假设日志',
    description: '记录项目假设的文件',
    category: 'register',
    isUpdateable: true
  },
  {
    id: 'agreement',
    name: '协议',
    description: '项目相关方之间的正式协议',
    category: 'other',
    isUpdateable: false
  },
  {
    id: 'business_case',
    name: '商业论证',
    description: '文档化的经济可行性研究报告，用来对尚缺乏充分定义的所选方案的收益进行有效性论证',
    category: 'other',
    isUpdateable: false
  },
  {
    id: 'benefits_management_plan',
    name: '收益管理计划',
    description: '描述项目收益如何实现、测量和维持的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'outputs_from_other_processes',
    name: '其他过程的输出',
    description: '来自其他项目管理过程的输出',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'approved_change_requests',
    name: '批准的变更请求',
    description: '经过整体变更控制过程审查和批准的变更请求',
    category: 'other',
    isUpdateable: false
  },
  {
    id: 'final_product_service_or_result_transition',
    name: '最终产品、服务或成果移交',
    description: '项目最终可交付成果的移交',
    category: 'other',
    isUpdateable: false
  },
  {
    id: 'final_report',
    name: '最终报告',
    description: '项目或阶段的最终报告',
    category: 'report',
    isUpdateable: false
  },
  {
    id: 'schedule_management_plan',
    name: '进度管理计划',
    description: '为规划、编制、管理、执行和控制项目进度而制定的政策、程序和文档',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'activity_list',
    name: '活动清单',
    description: '包含项目所需的全部进度活动的综合清单',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'milestone_list',
    name: '里程碑清单',
    description: '列出项目中的所有里程碑，并指明每个里程碑是强制性的还是选择性的',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_schedule_network_diagrams',
    name: '项目进度网络图',
    description: '展示项目进度活动之间的逻辑关系的图形',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'duration_estimates',
    name: '持续时间估算',
    description: '对完成单项活动所需工作时段数的定量评估',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'basis_of_estimates',
    name: '估算依据',
    description: '支持项目持续时间估算的文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'schedule_baseline',
    name: '进度基准',
    description: '经过批准的进度模型，用作与实际结果进行比较的依据',
    category: 'baseline',
    isUpdateable: true
  },
  {
    id: 'project_schedule',
    name: '项目进度计划',
    description: '进度模型的输出，展示计划的活动、里程碑、工作包和规划包',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'schedule_data',
    name: '进度数据',
    description: '描述和控制进度计划的信息集合',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_calendars',
    name: '项目日历',
    description: '表明可以开展进度活动的可用工作日和工作班次的日历',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'schedule_forecasts',
    name: '进度预测',
    description: '根据进度绩效信息，预测项目未来的进度情况',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'cost_management_plan',
    name: '成本管理计划',
    description: '描述如何规划、安排和控制项目成本的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'cost_estimates',
    name: '成本估算',
    description: '对完成项目工作所需资源成本的定量评估',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'cost_baseline',
    name: '成本基准',
    description: '经过批准的、按时间段分配的项目预算，用作与实际结果进行比较的依据',
    category: 'baseline',
    isUpdateable: true
  },
  {
    id: 'project_funding_requirements',
    name: '项目资金需求',
    description: '根据成本基准计算出的项目资金需求和总体资金需求',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'cost_forecasts',
    name: '成本预测',
    description: '根据成本绩效信息，预测项目未来的成本情况',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'quality_management_plan',
    name: '质量管理计划',
    description: '描述如何实施组织的质量政策，以及项目管理团队准备如何达到项目的质量要求',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'quality_metrics',
    name: '质量测量指标',
    description: '对项目或产品属性及其测量方式的描述',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'quality_control_measurements',
    name: '质量控制测量结果',
    description: '对质量控制活动的结果的书面记录',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'quality_reports',
    name: '质量报告',
    description: '用于报告质量管理问题、纠正措施建议以及在质量控制活动中发现的其他情况',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'test_and_evaluation_documents',
    name: '测试与评估文件',
    description: '用于评估质量目标的实现情况',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'resource_management_plan',
    name: '资源管理计划',
    description: '提供关于如何分类、分配、管理和释放项目资源的指南',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'team_charter',
    name: '团队章程',
    description: '为团队创建团队价值观、共识和工作指南的文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'resource_requirements',
    name: '资源需求',
    description: '识别为完成项目的各个部分，何时需要何种资源以及需要多少',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'resource_breakdown_structure',
    name: '资源分解结构',
    description: '按资源类别和类型，对团队和实物资源的层级展示',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'resource_calendars',
    name: '资源日历',
    description: '表明每种具体资源的可用工作日和工作班次的日历',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'physical_resource_assignments',
    name: '实物资源分配单',
    description: '记录项目将使用的材料、设备、用品、地点和其他实物资源',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'project_team_assignments',
    name: '项目团队派工单',
    description: '记录团队成员及其在项目中的角色和职责',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'team_performance_assessments',
    name: '团队绩效评价',
    description: '对项目团队成员的绩效进行正式或非正式评价',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'communications_management_plan',
    name: '沟通管理计划',
    description: '描述项目沟通的方法、形式和技术',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'project_communications',
    name: '项目沟通记录',
    description: '项目沟通的结果，包括但不限于：绩效报告、可交付成果状态、进度进展情况和已发生的成本',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'risk_management_plan',
    name: '风险管理计划',
    description: '描述如何安排与实施项目风险管理活动的文件',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'risk_register',
    name: '风险登记册',
    description: '记录风险分析的结果和风险应对计划的文件',
    category: 'register',
    isUpdateable: true
  },
  {
    id: 'risk_report',
    name: '风险报告',
    description: '提供关于整体项目风险的信息，以及关于已识别的单个项目风险的概述信息',
    category: 'report',
    isUpdateable: true
  },
  {
    id: 'procurement_management_plan',
    name: '采购管理计划',
    description: '描述如何从项目外部获取货物和服务',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'procurement_strategy',
    name: '采购策略',
    description: '确定项目交付方法、具有法律约束力的协议类型，以及如何在采购阶段推动采购进展',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'bid_documents',
    name: '招标文件',
    description: '用于从潜在卖方获取信息、报价、标书、报盘或建议书的文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'procurement_statement_of_work',
    name: '采购工作说明书',
    description: '对拟采购的产品、服务或成果的详细描述',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'source_selection_criteria',
    name: '供方选择标准',
    description: '用于评估投标人的建议书或为其评分的标准',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'make_or_buy_decisions',
    name: '自制或外购决策',
    description: '关于哪些产品、服务或成果需要从项目组织外部采购，哪些需要由项目团队自行提供的决策',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'procurement_documentation',
    name: '采购文档',
    description: '用于达成法律协议的所有文件',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'seller_proposals',
    name: '卖方建议书',
    description: '卖方为响应采购文件包而编制的建议书',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'selected_sellers',
    name: '选定的卖方',
    description: '经过建议书评估，被选中进行谈判的潜在卖方',
    category: 'other',
    isUpdateable: true
  },
  {
    id: 'closed_procurements',
    name: '结束的采购',
    description: '买方通过其授权的采购管理员向卖方发出关于合同已经完成的正式书面通知',
    category: 'other',
    isUpdateable: false
  },
  {
    id: 'stakeholder_register',
    name: '相关方登记册',
    description: '记录项目相关方识别、评估和分类结果的项目文件',
    category: 'register',
    isUpdateable: true
  },
  {
    id: 'stakeholder_engagement_plan',
    name: '相关方参与计划',
    description: '确定用于促进相关方有效参与决策和执行的策略和行动',
    category: 'plan',
    isUpdateable: true
  },
  {
    id: 'change_log',
    name: '变更日志',
    description: '记录项目期间发生的变更',
    category: 'register',
    isUpdateable: true
  }
]; 