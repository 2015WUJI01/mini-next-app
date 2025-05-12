'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getAllProblems, saveStudyMode } from '@/app/lib/storage';
import { Problem, StudyMode } from '@/app/types';
import Link from 'next/link';
import { Timer, Target, BookOpen } from 'lucide-react';

export default function StudyPage() {
  const searchParams = useSearchParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'random' | 'difficulty' | 'topic'>('random');
  const [settings, setSettings] = useState({
    timeLimit: 30,
    difficulty: 'easy' as const,
    topic: '',
  });

  useEffect(() => {
    const loadProblems = async () => {
      const allProblems = await getAllProblems();
      setProblems(allProblems);
      setLoading(false);
    };
    loadProblems();

    const modeParam = searchParams.get('mode');
    if (modeParam && ['random', 'difficulty', 'topic'].includes(modeParam)) {
      setMode(modeParam as 'random' | 'difficulty' | 'topic');
    }
  }, [searchParams]);

  const handleStart = async () => {
    const studyMode: StudyMode = {
      id: Date.now().toString(),
      name: `${mode} mode`,
      type: mode,
      problems: problems.map(p => p.id),
      settings: {
        timeLimit: settings.timeLimit,
        difficulty: settings.difficulty,
        topic: settings.topic,
      },
    };

    await saveStudyMode(studyMode);
    // TODO: 跳转到刷题页面
  };

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">刷题模式</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>模式选择</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={mode}
              onValueChange={(value) => setMode(value as typeof mode)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="random" id="random" />
                <Label htmlFor="random" className="flex items-center">
                  <Timer className="mr-2 h-4 w-4" />
                  随机模式
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="difficulty" id="difficulty" />
                <Label htmlFor="difficulty" className="flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  难度模式
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="topic" id="topic" />
                <Label htmlFor="topic" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  专题模式
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模式设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeLimit">时间限制（分钟）</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="120"
                value={settings.timeLimit}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    timeLimit: parseInt(e.target.value) || 30,
                  }))
                }
              />
            </div>

            {mode === 'difficulty' && (
              <div className="space-y-2">
                <Label>难度选择</Label>
                <RadioGroup
                  value={settings.difficulty}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: value as typeof settings.difficulty,
                    }))
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easy" id="easy" />
                    <Label htmlFor="easy">简单</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">中等</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hard" id="hard" />
                    <Label htmlFor="hard">困难</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {mode === 'topic' && (
              <div className="space-y-2">
                <Label htmlFor="topic">专题名称</Label>
                <Input
                  id="topic"
                  value={settings.topic}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      topic: e.target.value,
                    }))
                  }
                  placeholder="输入专题名称..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleStart} size="lg">
          开始刷题
        </Button>
      </div>
    </div>
  );
} 