import { Document } from './document';

export interface ProcessGroup {
  id: string;
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface KnowledgeArea {
  id: string;
  name: string;
  description: string;
  processGroups: ProcessGroup[];
}

export const KNOWLEDGE_AREAS: KnowledgeArea[] = [
  {
    id: 'integration',
    name: '整合管理',
    description: '识别、定义、组合、统一和协调项目管理过程组的各个过程和活动',
    processGroups: [
      {
        id: 'develop_project_charter',
        name: '制定项目章程',
        description: '编写一份正式批准项目并授权项目经理在项目活动中使用组织资源的文件的过程',
        inputs: ['business_case', 'benefits_management_plan', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_charter', 'assumptions_log'],
        status: 'not_started'
      },
      {
        id: 'develop_project_management_plan',
        name: '制定项目管理计划',
        description: '定义、准备和协调项目计划的所有组成部分，并将它们整合为一份综合项目管理计划的过程',
        inputs: ['project_charter', 'outputs_from_other_processes', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_management_plan'],
        status: 'not_started'
      },
      {
        id: 'direct_and_manage_project_work',
        name: '指导与管理项目工作',
        description: '为实现项目目标而领导和执行项目管理计划中所确定的工作，并实施已批准变更的过程',
        inputs: ['project_management_plan', 'project_documents', 'approved_change_requests', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['deliverables', 'work_performance_data', 'issue_log', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'manage_project_knowledge',
        name: '管理项目知识',
        description: '使用现有知识并生成新知识，以实现项目目标，并且帮助组织学习的过程',
        inputs: ['project_management_plan', 'project_documents', 'deliverables', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['lessons_learned_register', 'project_management_plan_updates', 'organizational_process_assets_updates'],
        status: 'not_started'
      },
      {
        id: 'monitor_and_control_project_work',
        name: '监控项目工作',
        description: '跟踪、审查和报告整体项目进展，以实现项目管理计划中确定的绩效目标的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['work_performance_reports', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'perform_integrated_change_control',
        name: '实施整体变更控制',
        description: '审查所有变更请求，批准变更，管理对可交付成果、项目文件和项目管理计划的变更，并对变更处理结果进行沟通的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_reports', 'change_requests', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['approved_change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'close_project_or_phase',
        name: '结束项目或阶段',
        description: '终结项目、阶段或合同的所有活动的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'accepted_deliverables', 'business_documents', 'agreements', 'procurement_documentation', 'organizational_process_assets'],
        outputs: ['project_documents_updates', 'final_product_service_or_result_transition', 'final_report', 'organizational_process_assets_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'scope',
    name: '范围管理',
    description: '确保项目包括成功完成项目所需的全部工作，且仅包括必需的工作',
    processGroups: [
      {
        id: 'plan_scope_management',
        name: '规划范围管理',
        description: '为记录如何定义、确认和控制项目范围及产品范围，而创建范围管理计划的过程',
        inputs: ['project_charter', 'project_management_plan', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['scope_management_plan', 'requirements_management_plan'],
        status: 'not_started'
      },
      {
        id: 'collect_requirements',
        name: '收集需求',
        description: '为实现项目目标而确定、记录并管理相关方的需要和需求的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'business_documents', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['requirements_documentation', 'requirements_traceability_matrix'],
        status: 'not_started'
      },
      {
        id: 'define_scope',
        name: '定义范围',
        description: '制定项目和产品详细描述的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_scope_statement', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'create_wbs',
        name: '创建WBS',
        description: '将项目可交付成果和项目工作分解为较小的、更易于管理的组件的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['scope_baseline', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'validate_scope',
        name: '确认范围',
        description: '正式验收已完成的项目可交付成果的过程',
        inputs: ['project_management_plan', 'project_documents', 'verified_deliverables', 'work_performance_data'],
        outputs: ['accepted_deliverables', 'change_requests', 'work_performance_information', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_scope',
        name: '控制范围',
        description: '监督项目和产品的范围状态，管理范围基准变更的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'schedule',
    name: '进度管理',
    description: '为管理项目按时完成所需的各个过程',
    processGroups: [
      {
        id: 'plan_schedule_management',
        name: '规划进度管理',
        description: '为规划、编制、管理、执行和控制项目进度而制定政策、程序和文档的过程',
        inputs: ['project_charter', 'project_management_plan', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['schedule_management_plan'],
        status: 'not_started'
      },
      {
        id: 'define_activities',
        name: '定义活动',
        description: '识别和记录为完成项目可交付成果而需采取的具体行动的过程',
        inputs: ['project_management_plan', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['activity_list', 'milestone_list', 'change_requests', 'project_management_plan_updates'],
        status: 'not_started'
      },
      {
        id: 'sequence_activities',
        name: '排列活动顺序',
        description: '识别和记录项目活动之间的关系的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_schedule_network_diagrams', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'estimate_activity_durations',
        name: '估算活动持续时间',
        description: '根据资源估算的结果，估算完成单项活动所需工作时段数的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['duration_estimates', 'basis_of_estimates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'develop_schedule',
        name: '制定进度计划',
        description: '分析活动顺序、持续时间、资源需求和进度制约因素，创建项目进度模型的过程',
        inputs: ['project_management_plan', 'project_documents', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['schedule_baseline', 'project_schedule', 'schedule_data', 'project_calendars', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_schedule',
        name: '控制进度',
        description: '监督项目状态，以更新项目进度和管理进度基准变更的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'schedule_forecasts', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'cost',
    name: '成本管理',
    description: '为使项目在批准的预算内完成而对成本进行规划、估算、预算、融资、筹资、管理和控制的各个过程',
    processGroups: [
      {
        id: 'plan_cost_management',
        name: '规划成本管理',
        description: '确定如何估算、预算、管理、监督和控制项目成本的过程',
        inputs: ['project_charter', 'project_management_plan', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['cost_management_plan'],
        status: 'not_started'
      },
      {
        id: 'estimate_costs',
        name: '估算成本',
        description: '对完成项目工作所需资源成本进行近似估算的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['cost_estimates', 'basis_of_estimates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'determine_budget',
        name: '制定预算',
        description: '汇总所有单个活动或工作包的估算成本，建立一个经批准的成本基准的过程',
        inputs: ['project_management_plan', 'project_documents', 'business_documents', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['cost_baseline', 'project_funding_requirements', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_costs',
        name: '控制成本',
        description: '监督项目状态，以更新项目成本和管理成本基准变更的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'cost_forecasts', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'quality',
    name: '质量管理',
    description: '把组织的质量政策应用于项目，并将质量管理计划转化为可执行的质量活动的过程',
    processGroups: [
      {
        id: 'plan_quality_management',
        name: '规划质量管理',
        description: '识别项目及其可交付成果的质量要求和标准，并书面描述项目将如何证明符合质量要求的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['quality_management_plan', 'quality_metrics', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'manage_quality',
        name: '管理质量',
        description: '把组织的质量政策用于项目，并将质量管理计划转化为可执行的质量活动的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['quality_reports', 'test_and_evaluation_documents', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_quality',
        name: '控制质量',
        description: '为了评估绩效，确保项目输出完整、正确，并满足客户期望，而监督和记录质量管理活动执行结果的过程',
        inputs: ['project_management_plan', 'project_documents', 'approved_change_requests', 'deliverables', 'work_performance_data', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['quality_control_measurements', 'verified_deliverables', 'work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'resource',
    name: '资源管理',
    description: '识别、获取和管理所需资源以成功完成项目的各个过程',
    processGroups: [
      {
        id: 'plan_resource_management',
        name: '规划资源管理',
        description: '定义如何估算、获取、管理和利用团队以及实物资源的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['resource_management_plan', 'team_charter', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'estimate_activity_resources',
        name: '估算活动资源',
        description: '估算执行项目所需的团队资源，以及材料、设备和用品的类型和数量的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['resource_requirements', 'basis_of_estimates', 'resource_breakdown_structure', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'acquire_resources',
        name: '获取资源',
        description: '获取项目所需的团队成员、设施、设备、材料、用品和其他资源的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['physical_resource_assignments', 'project_team_assignments', 'resource_calendars', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'develop_team',
        name: '建设团队',
        description: '提高工作能力，促进团队成员互动，改善团队整体氛围，以提高项目绩效的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['team_performance_assessments', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'manage_team',
        name: '管理团队',
        description: '跟踪团队成员工作表现，提供反馈，解决问题并管理团队变更，以优化项目绩效的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_reports', 'team_performance_assessments', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_resources',
        name: '控制资源',
        description: '确保按计划为项目分配实物资源，以及根据资源使用计划监督资源实际使用情况，并采取必要纠正措施的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'agreements', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'communication',
    name: '沟通管理',
    description: '为确保项目信息及时且恰当地规划、收集、生成、发布、存储、检索、管理、控制、监督和最终处置所需的各个过程',
    processGroups: [
      {
        id: 'plan_communications_management',
        name: '规划沟通管理',
        description: '基于每个相关方或相关方群体的信息需求、可用的组织资产，以及具体项目的需求，为项目沟通活动制定恰当的方法和计划的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['communications_management_plan'],
        status: 'not_started'
      },
      {
        id: 'manage_communications',
        name: '管理沟通',
        description: '确保项目信息及时且恰当地收集、生成、发布、存储、检索、管理、监督和最终处置的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_reports', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_communications', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'monitor_communications',
        name: '监督沟通',
        description: '确保满足项目及其相关方的信息需求的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'risk',
    name: '风险管理',
    description: '规划风险管理、识别风险、开展风险分析、规划风险应对、实施风险应对和监督风险的各个过程',
    processGroups: [
      {
        id: 'plan_risk_management',
        name: '规划风险管理',
        description: '定义如何实施项目风险管理活动的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['risk_management_plan'],
        status: 'not_started'
      },
      {
        id: 'identify_risks',
        name: '识别风险',
        description: '识别单个项目风险以及整体项目风险的来源，并记录风险特征的过程',
        inputs: ['project_management_plan', 'project_documents', 'agreements', 'procurement_documentation', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['risk_register', 'risk_report', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'perform_qualitative_risk_analysis',
        name: '实施定性风险分析',
        description: '通过评估单个项目风险发生的概率和影响以及其他特征，对风险进行优先级排序，从而为后续分析或行动提供基础的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'perform_quantitative_risk_analysis',
        name: '实施定量风险分析',
        description: '就已识别的单个项目风险和其他不确定性的来源对整体项目目标的综合影响进行定量分析的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'plan_risk_responses',
        name: '规划风险应对',
        description: '为处理整体项目风险敞口，以及应对单个项目风险，而制定可选方案、选择应对策略并商定应对行动的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'implement_risk_responses',
        name: '实施风险应对',
        description: '执行商定的风险应对计划的过程',
        inputs: ['project_management_plan', 'project_documents', 'organizational_process_assets'],
        outputs: ['change_requests', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'monitor_risks',
        name: '监督风险',
        description: '在整个项目期间，监督商定的风险应对计划的实施、跟踪已识别风险、识别和分析新风险，以及评估风险管理有效性的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_reports', 'work_performance_data'],
        outputs: ['work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'procurement',
    name: '采购管理',
    description: '从项目团队外部采购或获取所需产品、服务或成果的各个过程',
    processGroups: [
      {
        id: 'plan_procurement_management',
        name: '规划采购管理',
        description: '记录项目采购决策、明确采购方法，及识别潜在卖方的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['procurement_management_plan', 'procurement_strategy', 'bid_documents', 'procurement_statement_of_work', 'source_selection_criteria', 'make_or_buy_decisions', 'independent_cost_estimates', 'change_requests', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'conduct_procurements',
        name: '实施采购',
        description: '获取卖方应答、选择卖方并授予合同的过程',
        inputs: ['project_management_plan', 'project_documents', 'procurement_documentation', 'seller_proposals', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['selected_sellers', 'agreements', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'control_procurements',
        name: '控制采购',
        description: '管理采购关系，监督合同绩效，实施必要的变更和纠偏，以及关闭合同的过程',
        inputs: ['project_management_plan', 'project_documents', 'agreements', 'procurement_documentation', 'approved_change_requests', 'work_performance_data', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['closed_procurements', 'work_performance_information', 'procurement_documentation_updates', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  },
  {
    id: 'stakeholder',
    name: '相关方管理',
    description: '识别能够影响项目或会受项目影响的人员、团体或组织，分析相关方对项目的期望和影响，制定合适的管理策略来有效调动相关方参与项目决策和执行',
    processGroups: [
      {
        id: 'identify_stakeholders',
        name: '识别相关方',
        description: '定期识别项目相关方，分析和记录他们的利益、参与度、相互依赖性、影响力和对项目成功的潜在影响的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'agreements', 'business_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['stakeholder_register', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'plan_stakeholder_engagement',
        name: '规划相关方参与',
        description: '根据相关方的需求、期望、利益和对项目的潜在影响，制定项目相关方参与项目的方法的过程',
        inputs: ['project_charter', 'project_management_plan', 'project_documents', 'agreements', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['stakeholder_engagement_plan'],
        status: 'not_started'
      },
      {
        id: 'manage_stakeholder_engagement',
        name: '管理相关方参与',
        description: '与相关方进行沟通和协作，以满足其需求与期望，处理问题，并促进相关方合理参与的过程',
        inputs: ['project_management_plan', 'project_documents', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      },
      {
        id: 'monitor_stakeholder_engagement',
        name: '监督相关方参与',
        description: '监督项目相关方关系，并通过修订参与策略和计划来引导相关方合理参与项目的过程',
        inputs: ['project_management_plan', 'project_documents', 'work_performance_data', 'enterprise_environmental_factors', 'organizational_process_assets'],
        outputs: ['work_performance_information', 'change_requests', 'project_management_plan_updates', 'project_documents_updates'],
        status: 'not_started'
      }
    ]
  }
]; 