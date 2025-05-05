'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">健康饮食管理系统</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <Button asChild size="lg" className="px-8">
            <Link href="/recipes">食谱记录</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link href="/meal-planning">饮食编排</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
