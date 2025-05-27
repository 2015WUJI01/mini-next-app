import IntegrationManagement from '../integration_management'
import ScopeManagement from '../scope_management'
import ScheduleManagement from '../schedule_management'
import CostManagement from '../cost_management'
import QualityManagement from '../quality_management'
import ResourceManagement from '../resource_management'
import CommunicationManagement from '../communication_management'
import RiskManagement from '../risk_management'
import ProcurementManagement from '../procurement_management'
import StakeholderManagement from '../stakeholder_management'

const areaComponentMap: Record<string, React.FC> = {
  integration_management: IntegrationManagement,
  scope_management: ScopeManagement,
  schedule_management: ScheduleManagement,
  cost_management: CostManagement,
  quality_management: QualityManagement,
  resource_management: ResourceManagement,
  communication_management: CommunicationManagement,
  risk_management: RiskManagement,
  procurement_management: ProcurementManagement,
  stakeholder_management: StakeholderManagement,
}

export default function AreaPage({ params }: { params: { area: string } }) {
  const Comp = areaComponentMap[params.area]
  if (!Comp) return <div className="p-8">未知知识领域</div>
  return <Comp />
} 