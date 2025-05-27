import Link from 'next/link'
import { knowledgeAreas } from '../../lib/knowledge-areas'

export default function KnowledgePage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">知识领域总览</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {knowledgeAreas.map(area => (
          <Link key={area.id} href={`/knowledge/${area.id}`} className="block p-4 bg-card rounded shadow hover:bg-accent transition-colors">
            <span className="text-lg">{area.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
} 