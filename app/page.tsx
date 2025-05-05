'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-8 md:p-24 overflow-x-hidden">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">健康饮食管理系统</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Button asChild size="lg" className="px-8">
          <Link href="/recipes">食谱记录</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="px-8">
          <Link href="/meal-planning">饮食编排</Link>
        </Button>
      </div>
    </main>
  );
}
