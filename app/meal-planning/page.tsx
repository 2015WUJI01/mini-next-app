'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Coffee, Utensils, Moon, Search } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { SearchInput, SearchableItem } from "@/components/ui/search-input";

// 扩展 CalendarEvent 类型
interface ExtendedCalendarEvent extends CalendarEvent {
  mealType?: 'breakfast' | 'lunch' | 'dinner';
}

export default function MealPlanningPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [events, setEvents] = useState<ExtendedCalendarEvent[]>([]);
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
    
    const mealPlansData = localStorage.getItem('mealPlans');
    const mealPlans = mealPlansData ? JSON.parse(mealPlansData) : {};
    
    const allRecipes = recipeService.getAllRecipes();
    const recipesMap = new Map(allRecipes.map(recipe => [recipe.id, recipe]));
    
    const newEvents: ExtendedCalendarEvent[] = [];
    
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
              title: `☕ ${recipe.title}`,
              start: breakfastStart,
              end: breakfastEnd,
              color: 'yellow',
              mealType: 'breakfast'
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
              title: `🍽️ ${recipe.title}`,
              start: lunchStart,
              end: lunchEnd,
              color: 'green',
              mealType: 'lunch'
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
              title: `🌙 ${recipe.title}`,
              start: dinnerStart,
              end: dinnerEnd,
              color: 'indigo',
              mealType: 'dinner'
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
    <>
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
          <div className="h-[calc(100vh-267px)] flex flex-col box-border">
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
    </>
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
  const [selectedRecipes, setSelectedRecipes] = useState<Set<string>>(new Set());
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  
  useEffect(() => {
    if (recipeService) {
      const recipes = recipeService.getAllRecipes();
      setAllRecipes(recipes);
      setFilteredRecipes(recipes);
    }
  }, []);

  // 初始化已选中的食谱
  useEffect(() => {
    const selected = new Set(mealRecipes.map(recipe => recipe.id));
    setSelectedRecipes(selected);
  }, [mealRecipes]);

  // 处理复选框变化
  const handleCheckboxChange = (recipeId: string, checked: boolean) => {
    const newSelected = new Set(selectedRecipes);
    if (checked) {
      newSelected.add(recipeId);
    } else {
      newSelected.delete(recipeId);
    }
    setSelectedRecipes(newSelected);
  };

  // 批量添加选中的食谱
  const handleBatchAssign = () => {
    selectedRecipes.forEach(recipeId => {
      if (!mealRecipes.some(recipe => recipe.id === recipeId)) {
        onAssign(recipeId);
      }
    });
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">{title}</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              选择食谱
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>选择{title}食谱</SheetTitle>
              <SheetDescription>
                勾选要添加的食谱，可以一次选择多个
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <SearchInput
                items={allRecipes}
                onSearch={setFilteredRecipes}
                placeholder="搜索食谱..."
                searchFields={['title', 'description', 'ingredients']}
              />
              <div className="space-y-2 overflow-auto h-[calc(100vh-280px)]">
                {filteredRecipes.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {filteredRecipes.map(item => (
                      <div key={item.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                        <Checkbox
                          id={`recipe-${item.id}`}
                          checked={selectedRecipes.has(item.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                        />
                        <label
                          htmlFor={`recipe-${item.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.ingredients.length} 种食材</div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    没有找到匹配的食谱
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-background p-4 border-t">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    handleBatchAssign();
                    const closeButton = document.querySelector('button[data-state="open"]') as HTMLButtonElement;
                    closeButton?.click();
                  }}
                >
                  确认添加
                </Button>
              </div>
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