'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProblem, saveSubmission } from '@/app/lib/storage';
import { Problem, Submission } from '@/app/types';
import Editor from '@monaco-editor/react';
import { Play, Save, Bookmark } from 'lucide-react';

export default function ProblemPage() {
  const params = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('// 在这里编写你的代码');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const loadProblem = async () => {
      if (params.id) {
        const problemData = await getProblem(params.id as string);
        if (problemData) {
          setProblem(problemData);
        }
        setLoading(false);
      }
    };
    loadProblem();
  }, [params.id]);

  const handleSubmit = async () => {
    if (!problem) return;

    const submission: Submission = {
      id: Date.now().toString(),
      userId: 'user-1', // 暂时使用固定用户ID
      problemId: problem.id,
      code,
      language: 'javascript',
      status: 'accepted', // 暂时固定为通过
      runtime: Math.random() * 100, // 模拟运行时间
      memory: Math.random() * 1000, // 模拟内存使用
      timestamp: new Date(),
    };

    await saveSubmission(submission);
    // TODO: 显示提交结果
  };

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }

  if (!problem) {
    return <div className="text-center">题目不存在</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{problem.title}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="description">题目描述</TabsTrigger>
          <TabsTrigger value="solution">题解</TabsTrigger>
          <TabsTrigger value="discussion">讨论</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>题目描述</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: problem.content }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>示例</CardTitle>
            </CardHeader>
            <CardContent>
              {problem.examples.map((example, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-medium mb-2">示例 {index + 1}</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <p><strong>输入：</strong> {example.input}</p>
                    <p><strong>输出：</strong> {example.output}</p>
                    {example.explanation && (
                      <p><strong>解释：</strong> {example.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>约束条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solution">
          <Card>
            <CardHeader>
              <CardTitle>代码编辑器</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] border rounded-md">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setCode('// 在这里编写你的代码')}>
                  重置
                </Button>
                <Button onClick={handleSubmit}>
                  <Play className="mr-2 h-4 w-4" />
                  提交
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>讨论区</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">讨论功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 