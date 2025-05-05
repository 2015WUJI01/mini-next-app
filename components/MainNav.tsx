'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MainNav() {
  return (
    <div className="w-full max-w-screen-xl mx-auto py-2 md:py-3 px-4 flex flex-wrap items-center justify-between">
      <Link href="/" className="text-xl font-semibold py-2">
        健康饮食管理
      </Link>
      <nav className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button variant="ghost" size="sm" className="h-9 px-2 md:px-4" asChild>
          <Link href="/recipes">食谱记录</Link>
        </Button>
        <Button variant="ghost" size="sm" className="h-9 px-2 md:px-4" asChild>
          <Link href="/meal-planning">饮食编排</Link>
        </Button>
        
        <Button variant="ghost" size="sm" className="h-9 px-2 md:px-4" asChild>
          <Link href="/data-management">数据管理</Link>
        </Button>
      </nav>
    </div>
  );
} 