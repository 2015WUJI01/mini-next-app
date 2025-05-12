'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllProblems } from './lib/storage';
import { Problem } from './types';
import Link from 'next/link';
import { BarChart3, BookOpen, Target } from 'lucide-react';

export default function Home() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProblems = async () => {
      const allProblems = await getAllProblems();
      setProblems(allProblems);
      setLoading(false);
    };
    loadProblems();
  }, []);

  const getDifficultyCount = (difficulty: string) => {
    return problems.filter(p => p.difficulty === difficulty).length;
  };

  const stats = [
    {
      title: '总题目数',
      value: problems.length,
      icon: BookOpen,
    },
    {
      title: '简单题目',
      value: getDifficultyCount('easy'),
      icon: Target,
    },
    {
      title: '中等题目',
      value: getDifficultyCount('medium'),
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>开始刷题</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              选择一种刷题模式开始练习
            </p>
            <div className="space-y-2">
              <Link href="/study?mode=random" className="w-full">
                <Button variant="outline" className="w-full">
                  随机模式
                </Button>
              </Link>
              <Link href="/study?mode=difficulty" className="w-full">
                <Button variant="outline" className="w-full">
                  难度模式
                </Button>
              </Link>
              <Link href="/study?mode=topic" className="w-full">
                <Button variant="outline" className="w-full">
                  专题模式
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近做题</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">加载中...</p>
            ) : problems.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无做题记录</p>
            ) : (
              <div className="space-y-2">
                {problems.slice(0, 5).map((problem) => (
                  <Link
                    key={problem.id}
                    href={`/problems/${problem.id}`}
                    className="block p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{problem.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {problem.difficulty}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>题目分类</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/problems?difficulty=easy" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  简单题目
                </Button>
              </Link>
              <Link href="/problems?difficulty=medium" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  中等题目
                </Button>
              </Link>
              <Link href="/problems?difficulty=hard" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  困难题目
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
