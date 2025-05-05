'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MealCalendar } from "@/components/MealCalendar";
import { useState } from "react";
import { format } from "date-fns";

export default function MealPlanningPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">饮食编排</h1>
        <Button asChild>
          <Link href="/recipes">查看我的食谱</Link>
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{format(currentMonth, 'yyyy年MM月')}</h2>
          <p className="text-gray-500">点击日期查看和安排每日饮食</p>
        </div>
        
        <MealCalendar />
      </div>
    </div>
  );
} 