'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Recipe, recipeService } from "@/lib/recipes";
import { MealPlan, mealPlanningService } from "@/lib/meal-planning";
import { zhCN } from "date-fns/locale";
import {
  Calendar,
  CalendarEvent,
  CalendarViewTrigger,
  CalendarCurrentDate,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarNextTrigger,
  CalendarDayView,
  CalendarWeekView,
  CalendarMonthView,
  CalendarYearView,
} from "@/components/ui/full-calendar";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetTrigger,
  SheetFooter 
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

export default function MealPlanningPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 加载食谱数据
  useEffect(() => {
    if (recipeService) {
      setRecipes(recipeService.getAllRecipes());
    }
  }, []);

  // 加载饮食编排数据转换为日历事件
  useEffect(() => {
    loadMealEvents();
  }, []);

  // 将饮食计划加载为日历事件
  const loadMealEvents = () => {
    if (!recipeService || !mealPlanningService) return;
    
    // 读取本地存储中的饮食计划数据
    const mealPlansData = localStorage.getItem('mealPlans');
    const mealPlans = mealPlansData ? JSON.parse(mealPlansData) : {};
    
    const allRecipes = recipeService.getAllRecipes();
    const recipesMap = new Map(allRecipes.map(recipe => [recipe.id, recipe]));
    
    const newEvents: CalendarEvent[] = [];
    
    // 辅助函数：确保值是数组
    const ensureArray = (value: any): string[] => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };
    
    Object.values(mealPlans).forEach((plan: any) => {
      if (!plan.date) return;
      
      const date = new Date(plan.date);
      
      // 处理早餐
      const breakfastIds = ensureArray(plan.breakfast);
      breakfastIds.forEach((id, index) => {
        if (recipesMap.has(id)) {
          const recipe = recipesMap.get(id);
          if (recipe) {
            const breakfastStart = new Date(date);
            breakfastStart.setHours(7, 0, 0, 0);
            
            const breakfastEnd = new Date(date);
            breakfastEnd.setHours(9, 0, 0, 0);
            
            newEvents.push({
              id: `breakfast-${plan.date}-${id}`,
              title: `早餐: ${recipe.title}`,
              start: breakfastStart,
              end: breakfastEnd,
              color: 'red',
            });
          }
        }
      });
      
      // 处理午餐
      const lunchIds = ensureArray(plan.lunch);
      lunchIds.forEach((id, index) => {
        if (recipesMap.has(id)) {
          const recipe = recipesMap.get(id);
          if (recipe) {
            const lunchStart = new Date(date);
            lunchStart.setHours(12, 0, 0, 0);
            
            const lunchEnd = new Date(date);
            lunchEnd.setHours(14, 0, 0, 0);
            
            newEvents.push({
              id: `lunch-${plan.date}-${id}`,
              title: `午餐: ${recipe.title}`,
              start: lunchStart,
              end: lunchEnd,
              color: 'green',
            });
          }
        }
      });
      
      // 处理晚餐
      const dinnerIds = ensureArray(plan.dinner);
      dinnerIds.forEach((id, index) => {
        if (recipesMap.has(id)) {
          const recipe = recipesMap.get(id);
          if (recipe) {
            const dinnerStart = new Date(date);
            dinnerStart.setHours(18, 0, 0, 0);
            
            const dinnerEnd = new Date(date);
            dinnerEnd.setHours(20, 0, 0, 0);
            
            newEvents.push({
              id: `dinner-${plan.date}-${id}`,
              title: `晚餐: ${recipe.title}`,
              start: dinnerStart,
              end: dinnerEnd,
              color: 'blue',
            });
          }
        }
      });
    });
    
    setEvents(newEvents);
  };

  // 处理日期点击
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    
    // 从mealPlanningService中获取该日期的饮食计划
    if (mealPlanningService) {
      const dateStr = format(date, 'yyyy-MM-dd');
      const plan = mealPlanningService.getMealPlanByDate(dateStr);
      setSelectedMealPlan(plan || { date: dateStr });
      setIsDialogOpen(true);
    }
  };

  // 添加食谱到指定餐食
  const assignRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => {
    if (!selectedDate || !mealPlanningService) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const updatedPlan = mealPlanningService.addRecipeToMeal(dateStr, mealType, recipeId);
    setSelectedMealPlan(updatedPlan);
    
    // 重新加载日历事件
    loadMealEvents();
  };
  
  // 从餐食中移除单个食谱
  const removeRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => {
    if (!selectedDate || !mealPlanningService) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const updatedPlan = mealPlanningService.removeRecipeFromMeal(dateStr, mealType, recipeId);
    setSelectedMealPlan(updatedPlan);
    
    // 重新加载日历事件
    loadMealEvents();
  };
  
  // 获取指定餐食的所有食谱详情
  const getMealRecipes = (mealType: 'breakfast' | 'lunch' | 'dinner'): Recipe[] => {
    if (!selectedMealPlan || !selectedMealPlan[mealType] || !recipeService) return [];
    
    // 确保是数组
    const recipeIds = Array.isArray(selectedMealPlan[mealType]) 
      ? selectedMealPlan[mealType] as string[]
      : [selectedMealPlan[mealType]] as string[];
    
    // 获取所有有效的食谱对象
    return recipeIds
      .map(id => {
        if (recipeService) {
          return recipeService.getRecipe(id);
        }
        return null;
      })
      .filter((recipe): recipe is Recipe => recipe !== null);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">饮食编排</h1>
        <Button asChild>
          <Link href="/recipes">查看我的食谱</Link>
        </Button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <Calendar 
          events={events} 
          locale={zhCN}
          defaultView="month"
          visibleViews={['month']}
        >
          <div className="h-[calc(100vh-257px)] flex flex-col">
            <div className="flex px-2 items-center gap-2 mb-6">
              <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
                日视图
              </CalendarViewTrigger>
              <CalendarViewTrigger view="week" className="aria-[current=true]:bg-accent">
                周视图
              </CalendarViewTrigger>
              <CalendarViewTrigger view="month" className="aria-[current=true]:bg-accent">
                月视图
              </CalendarViewTrigger>
              <CalendarViewTrigger view="year" className="aria-[current=true]:bg-accent">
                年视图
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarCurrentDate />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">上一个</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger>今天</CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">下一个</span>
              </CalendarNextTrigger>
            </div>

            <div className="flex-1 overflow-auto px-2 relative">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView onDayClick={handleDayClick} />
              <CalendarYearView />
            </div>
          </div>
        </Calendar>
      </div>
      
      {/* 饮食编排对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, 'yyyy年MM月dd日')} 饮食安排
            </DialogTitle>
            <DialogDescription>
              为这一天安排早餐、午餐和晚餐
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <MealSection 
              title="早餐" 
              mealType="breakfast"
              recipes={getMealRecipes('breakfast')}
              onAssign={(recipeId) => assignRecipe('breakfast', recipeId)}
              onRemove={(recipeId) => removeRecipe('breakfast', recipeId)}
            />
            
            <MealSection 
              title="午餐" 
              mealType="lunch"
              recipes={getMealRecipes('lunch')}
              onAssign={(recipeId) => assignRecipe('lunch', recipeId)}
              onRemove={(recipeId) => removeRecipe('lunch', recipeId)}
            />
            
            <MealSection 
              title="晚餐" 
              mealType="dinner"
              recipes={getMealRecipes('dinner')}
              onAssign={(recipeId) => assignRecipe('dinner', recipeId)}
              onRemove={(recipeId) => removeRecipe('dinner', recipeId)}
            />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>完成</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 单餐区域组件
interface MealSectionProps {
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipes: Recipe[];
  onAssign: (recipeId: string) => void;
  onRemove: (recipeId: string) => void;
}

function MealSection({ title, mealType, recipes: mealRecipes, onAssign, onRemove }: MealSectionProps) {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    if (recipeService) {
      setAllRecipes(recipeService.getAllRecipes());
    }
  }, []);
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">{title}</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              添加食谱
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>选择{title}食谱</SheetTitle>
              <SheetDescription>
                从你的食谱库中选择一个食谱作为{title}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2 overflow-auto h-[calc(100vh-200px)]">
              {allRecipes.length > 0 ? (
                allRecipes.map(item => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() => {
                      onAssign(item.id);
                      const closeButton = document.querySelector('button[data-state="open"]') as HTMLButtonElement;
                      closeButton?.click();
                    }}
                  >
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.ingredients.length} 种食材</div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无食谱，请先添加食谱
                </div>
              )}
            </div>
            <SheetFooter className="mt-4">
              <Button variant="secondary" asChild>
                <Link href="/recipes/new">创建新食谱</Link>
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {mealRecipes.length > 0 ? (
        <div className="space-y-4">
          {mealRecipes.map(recipe => (
            <div key={recipe.id} className="p-3 border rounded-md">
              <div className="text-sm font-medium">{recipe.title}</div>
              <div className="text-xs text-gray-500 mt-1">{recipe.description}</div>
              <div className="flex justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={() => onRemove(recipe.id)}>
                  移除
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center text-gray-400 text-sm">
          暂未安排食谱
        </div>
      )}
    </div>
  );
} 