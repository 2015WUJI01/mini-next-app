import { KNOWLEDGE_AREAS } from '../lib/knowledge-areas'
import { DOCUMENTS } from '../lib/document'

export default function Home() {
  const getDocumentInfo = (documentId: string) => {
    const doc = DOCUMENTS.find(doc => doc.id === documentId);
    return doc || { id: documentId, name: documentId };
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">项目管理知识领域</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KNOWLEDGE_AREAS.map((area) => (
          <div key={area.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{area.name}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">输入文档：</h3>
                <ul className="list-disc list-inside space-y-1">
                  {area.inputs.map((input) => {
                    const doc = getDocumentInfo(input);
                    return (
                      <li key={input} className="text-gray-600 hover:text-gray-900">
                        {doc.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">输出文档：</h3>
                <ul className="list-disc list-inside space-y-1">
                  {area.outputs.map((output) => {
                    const doc = getDocumentInfo(output);
                    return (
                      <li key={output} className="text-gray-600 hover:text-gray-900">
                        {doc.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 