'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExportImportData } from '@/components/ExportImportData';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">健康饮食管理系统</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="px-8">
          <Link href="/recipes">食谱记录</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="px-8">
          <Link href="/meal-planning">饮食编排</Link>
        </Button>
      </div>
      
      <div className="mt-8 border rounded-lg p-6 w-full max-w-md">
        <ExportImportData />
      </div>
    </main>
  );
}
