'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllProblems, saveProblem, importData, exportData } from '@/app/lib/storage';
import { Problem } from '@/app/types';
import Link from 'next/link';
import { Search, Filter, Plus, Upload, Edit, Trash2, Bot } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function emptyProblem(): Problem {
  return {
    id: Date.now().toString(),
    title: '',
    content: '',
    difficulty: 'easy',
    tags: [],
    examples: [],
    constraints: '',
    solutions: [],
    relatedProblems: [],
    acceptance: 1,
    frequency: 1,
    options: ['', '', '', ''],
    answer: 0,
  };
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editProblem, setEditProblem] = useState<Problem | null>(null);
  const [formProblem, setFormProblem] = useState<Problem>(emptyProblem());
  const [showAIImport, setShowAIImport] = useState(false);
  const [aiInput, setAIInput] = useState('');
  const [aiLoading, setAILoading] = useState(false);

  useEffect(() => {
    const loadProblems = async () => {
      const allProblems = await getAllProblems();
      setProblems(allProblems);
      setFilteredProblems(allProblems);
      setLoading(false);
    };
    loadProblems();
  }, []);

  useEffect(() => {
    let filtered = problems;
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    if (difficultyFilter) {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }
    setFilteredProblems(filtered);
  }, [searchQuery, difficultyFilter, problems]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // 新增/编辑题目表单提交
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProblem(formProblem);
    setShowForm(false);
    setEditProblem(null);
    setFormProblem(emptyProblem());
    // 重新加载题目
    const allProblems = await getAllProblems();
    setProblems(allProblems);
  };

  // 编辑题目
  const handleEdit = (problem: Problem) => {
    setEditProblem(problem);
    setFormProblem(problem);
    setShowForm(true);
  };

  // 删除题目
  const handleDelete = async (id: string) => {
    const db = await (await import('idb')).openDB('quiz-db', 1);
    await db.delete('problems', id);
    const allProblems = await getAllProblems();
    setProblems(allProblems);
  };

  // 批量导入
  const handleBatchImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await importData(file);
        const allProblems = await getAllProblems();
        setProblems(allProblems);
      }
    };
    input.click();
  };

  // 智能导入（AI）
  const handleAIImport = async () => {
    setAILoading(true);
    // 这里应调用你的 AI API，返回题目对象
    // 示例：假设返回 result: Problem
    // const result = await fetch('/api/ai-import', { method: 'POST', body: JSON.stringify({ text: aiInput }) })
    //   .then(res => res.json());
    // 这里用 mock
    const result: Problem = {
      ...emptyProblem(),
      id: Date.now().toString(),
      title: 'AI 生成题目示例',
      content: aiInput,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
    };
    await saveProblem(result);
    setAILoading(false);
    setShowAIImport(false);
    setAIInput('');
    const allProblems = await getAllProblems();
    setProblems(allProblems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">题目列表</h1>
        <div className="flex items-center space-x-2">
          <Button onClick={() => { setShowForm(true); setFormProblem(emptyProblem()); setEditProblem(null); }}>
            <Plus className="mr-2 h-4 w-4" /> 新增题目
          </Button>
          <Button variant="outline" onClick={handleBatchImport}>
            <Upload className="mr-2 h-4 w-4" /> 批量导入
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Upload className="mr-2 h-4 w-4 rotate-180" /> 导出全部
          </Button>
          <Button variant="outline" onClick={() => setShowAIImport(true)}>
            <Bot className="mr-2 h-4 w-4" /> 智能导入
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索题目..."
              className="pl-8"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDifficultyFilter(null)}>
                全部难度
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('easy')}>
                简单
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('medium')}>
                中等
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficultyFilter('hard')}>
                困难
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 新增/编辑题目表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
            onSubmit={handleFormSubmit}
          >
            <h2 className="text-xl font-bold mb-2">{editProblem ? '编辑题目' : '新增题目'}</h2>
            <Input
              placeholder="题目标题"
              value={formProblem.title}
              onChange={e => setFormProblem({ ...formProblem, title: e.target.value })}
              required
            />
            <Input
              placeholder="题目内容"
              value={formProblem.content}
              onChange={e => setFormProblem({ ...formProblem, content: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Input
                placeholder="标签（逗号分隔）"
                value={formProblem.tags.join(',')}
                onChange={e => setFormProblem({ ...formProblem, tags: e.target.value.split(',').map(s => s.trim()) })}
              />
              <Input
                placeholder="难度（easy/medium/hard）"
                value={formProblem.difficulty}
                onChange={e => setFormProblem({ ...formProblem, difficulty: e.target.value as any })}
              />
            </div>
            <div>
              <div className="mb-1">选项：</div>
              {formProblem.options?.map((opt, idx) => (
                <div key={idx} className="flex gap-2 mb-1">
                  <Input
                    value={opt}
                    onChange={e => {
                      const opts = [...(formProblem.options || [])];
                      opts[idx] = e.target.value;
                      setFormProblem({ ...formProblem, options: opts });
                    }}
                    placeholder={`选项${String.fromCharCode(65 + idx)}`}
                  />
                  <Button
                    type="button"
                    variant={formProblem.answer === idx ? 'default' : 'outline'}
                    onClick={() => setFormProblem({ ...formProblem, answer: idx })}
                  >
                    正确
                  </Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => setFormProblem({ ...formProblem, options: [...(formProblem.options || []), ''] })}>
                + 添加选项
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditProblem(null); }}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </div>
          </form>
        </div>
      )}

      {/* 智能导入弹窗 */}
      {showAIImport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
            onSubmit={e => { e.preventDefault(); handleAIImport(); }}
          >
            <h2 className="text-xl font-bold mb-2">智能导入</h2>
            <textarea
              className="w-full h-32 p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-transparent"
              placeholder="请输入题目描述、选项、答案等信息，AI 会自动生成题目"
              value={aiInput}
              onChange={e => setAIInput(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAIImport(false)}>
                取消
              </Button>
              <Button type="submit" disabled={aiLoading}>
                {aiLoading ? '生成中...' : '生成并添加'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">加载中...</p>
      ) : filteredProblems.length === 0 ? (
        <p className="text-center text-muted-foreground">没有找到相关题目</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:bg-muted/50 transition-colors relative group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{problem.title}</span>
                  <span className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {problem.options && (
                  <div className="mb-2">
                    <div className="font-semibold text-xs mb-1">选项：</div>
                    <ul className="list-disc pl-5">
                      {problem.options.map((opt, idx) => (
                        <li key={idx} className={problem.answer === idx ? 'font-bold text-green-600' : ''}>
                          {String.fromCharCode(65 + idx)}. {opt}
                          {problem.answer === idx && <span className="ml-2 text-xs">(正确)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(problem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(problem.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 