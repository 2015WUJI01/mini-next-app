'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Coffee, Utensils, Moon, Search, Sun } from "lucide-react";
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
import { format, addDays } from "date-fns";
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
  const [selectedMeals, setSelectedMeals] = useState<{
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  }>({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [isQuickSelectMode, setIsQuickSelectMode] = useState(false);
  const [tempMealPlan, setTempMealPlan] = useState<{
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  }>({
    breakfast: [],
    lunch: [],
    dinner: []
  });
  const [futureMealPlans, setFutureMealPlans] = useState<{
    [key: string]: {
      lunch: string[];
      dinner: string[];
    };
  }>({});
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  // 加载食谱数据
  useEffect(() => {
    if (recipeService) {
      const allRecipes = recipeService.getAllRecipes();
      setRecipes(allRecipes);
      setFilteredRecipes(allRecipes);
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
  
  // 处理食谱选择
  const handleMealSelect = (mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => {
    setSelectedMeals(prev => {
      const currentMeals = prev[mealType];
      const newMeals = currentMeals.includes(recipeId)
        ? currentMeals.filter(id => id !== recipeId)
        : [...currentMeals, recipeId];
      
      return {
        ...prev,
        [mealType]: newMeals
      };
    });
  };

  // 保存膳食安排
  const handleSaveMeals = () => {
    if (!selectedDate || !mealPlanningService) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // 分别设置每个餐段的食谱
    selectedMeals.breakfast.forEach(recipeId => {
      mealPlanningService.setMealPlan(dateStr, 'breakfast', recipeId);
    });
    
    selectedMeals.lunch.forEach(recipeId => {
      mealPlanningService.setMealPlan(dateStr, 'lunch', recipeId);
    });
    
    selectedMeals.dinner.forEach(recipeId => {
      mealPlanningService.setMealPlan(dateStr, 'dinner', recipeId);
    });
    
    const updatedPlan = {
      date: dateStr,
      breakfast: selectedMeals.breakfast,
      lunch: selectedMeals.lunch,
      dinner: selectedMeals.dinner
    };
    
    setSelectedMealPlan(updatedPlan);
    loadMealEvents();
    setIsDialogOpen(false);
  };

  // 当打开对话框时，初始化已选择的食谱
  useEffect(() => {
    if (selectedMealPlan) {
      setSelectedMeals({
        breakfast: Array.isArray(selectedMealPlan.breakfast) ? selectedMealPlan.breakfast : [],
        lunch: Array.isArray(selectedMealPlan.lunch) ? selectedMealPlan.lunch : [],
        dinner: Array.isArray(selectedMealPlan.dinner) ? selectedMealPlan.dinner : []
      });
    }
  }, [selectedMealPlan]);

  // 处理快速选择模式下的食谱分配
  const handleQuickAssign = (
    recipeId: string, 
    mealType: 'breakfast' | 'lunch' | 'dinner',
    dateOffset: number = 0
  ) => {
    if (dateOffset === 0) {
      // 当天分配
      setTempMealPlan(prev => {
        const currentMeals = prev[mealType];
        const newMeals = currentMeals.includes(recipeId)
          ? currentMeals.filter(id => id !== recipeId)
          : [...currentMeals, recipeId];
        
        return {
          ...prev,
          [mealType]: newMeals
        };
      });
    } else {
      // 未来日期分配
      const date = new Date(selectedDate!);
      date.setDate(date.getDate() + dateOffset);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      setFutureMealPlans(prev => {
        const currentPlan = prev[dateStr] || { lunch: [], dinner: [] };
        const currentMeals = currentPlan[mealType];
        const newMeals = currentMeals.includes(recipeId)
          ? currentMeals.filter(id => id !== recipeId)
          : [...currentMeals, recipeId];
        
        return {
          ...prev,
          [dateStr]: {
            ...currentPlan,
            [mealType]: newMeals
          }
        };
      });
    }
  };

  // 保存快速选择的食谱
  const handleSaveQuickSelect = () => {
    // 保存当天的计划
    setSelectedMeals(tempMealPlan);
    
    // 保存未来日期的计划
    Object.entries(futureMealPlans).forEach(([dateStr, plan]) => {
      if (mealPlanningService) {
        plan.lunch.forEach(recipeId => {
          mealPlanningService.setMealPlan(dateStr, 'lunch', recipeId);
        });
        plan.dinner.forEach(recipeId => {
          mealPlanningService.setMealPlan(dateStr, 'dinner', recipeId);
        });
      }
    });
    
    setIsQuickSelectMode(false);
    setFutureMealPlans({});
  };

  // 进入快速选择模式时初始化临时计划
  useEffect(() => {
    if (isQuickSelectMode) {
      setTempMealPlan(selectedMeals);
      setFilteredRecipes(recipes); // 重置搜索结果
    }
  }, [isQuickSelectMode, selectedMeals, recipes]);

  // 处理快速选择模式下的搜索
  const handleQuickSearch = (items: Recipe[]) => {
    setFilteredRecipes(items);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">膳食计划</h1>
      <div className="bg-card rounded-lg shadow p-4">
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>安排 {selectedDate?.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} 的膳食</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {isQuickSelectMode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <SearchInput
                    items={recipes}
                    onSearch={handleQuickSearch}
                    placeholder="搜索食谱..."
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSaveQuickSelect();
                      setIsQuickSelectMode(false);
                    }}
                  >
                    结束编排
                  </Button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {filteredRecipes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      没有可用的食谱
                    </p>
                  ) : (
                    filteredRecipes.map(recipe => (
                      <div
                        key={recipe.id}
                        className="flex items-center gap-2 p-2 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{recipe.title}</p>
                          {recipe.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {recipe.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    tempMealPlan.breakfast.includes(recipe.id)
                                      ? "text-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleQuickAssign(recipe.id, 'breakfast')}
                                >
                                  <Sun className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>今天早餐</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    tempMealPlan.lunch.includes(recipe.id)
                                      ? "text-orange-500"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleQuickAssign(recipe.id, 'lunch')}
                                >
                                  <Utensils className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>今天午餐</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    tempMealPlan.dinner.includes(recipe.id)
                                      ? "text-blue-500"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleQuickAssign(recipe.id, 'dinner')}
                                >
                                  <Moon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>今天晚餐</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <div className="w-px h-6 bg-border mx-1" />

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    futureMealPlans[format(addDays(selectedDate!, 1), 'yyyy-MM-dd')]?.lunch.includes(recipe.id)
                                      ? "text-orange-500"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleQuickAssign(recipe.id, 'lunch', 1)}
                                >
                                  <Utensils className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>明天午餐</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`h-8 w-8 ${
                                    futureMealPlans[format(addDays(selectedDate!, 1), 'yyyy-MM-dd')]?.dinner.includes(recipe.id)
                                      ? "text-blue-500"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleQuickAssign(recipe.id, 'dinner', 1)}
                                >
                                  <Moon className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>明天晚餐</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">分餐段选择</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsQuickSelectMode(true);
                      setTempMealPlan(selectedMeals);
                    }}
                  >
                    快速编排
                  </Button>
                </div>
                <MealSection
                  title="早餐"
                  icon={Sun}
                  color="text-yellow-500"
                  recipes={recipes}
                  selectedRecipes={selectedMeals.breakfast}
                  onSelect={(id) => handleMealSelect('breakfast', id)}
                />
                <MealSection
                  title="午餐"
                  icon={Utensils}
                  color="text-orange-500"
                  recipes={recipes}
                  selectedRecipes={selectedMeals.lunch}
                  onSelect={(id) => handleMealSelect('lunch', id)}
                />
                <MealSection
                  title="晚餐"
                  icon={Moon}
                  color="text-blue-500"
                  recipes={recipes}
                  selectedRecipes={selectedMeals.dinner}
                  onSelect={(id) => handleMealSelect('dinner', id)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter className={`mt-4 pt-4 ${!isQuickSelectMode ? 'border-t' : ''}`}>
            {!isQuickSelectMode && (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveMeals}>
                  完成
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 单餐区域组件
interface MealSectionProps {
  title: string;
  icon: React.ElementType;
  color: string;
  recipes: Recipe[];
  selectedRecipes: string[];
  onSelect: (recipeId: string) => void;
}

function MealSection({ 
  title, 
  icon: Icon, 
  color, 
  recipes, 
  selectedRecipes, 
  onSelect 
}: MealSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => 
          typeof ing === 'string' 
            ? ing.toLowerCase().includes(query)
            : ing.name.toLowerCase().includes(query)
        )
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  return (
    <div className="space-y-2">
      <div 
        className="flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-accent/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <h3 className="font-medium">{title}</h3>
          <span className="text-sm text-muted-foreground">
            ({selectedRecipes.length} 个食谱)
          </span>
        </div>
        <ChevronRight 
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
      </div>
      
      {isExpanded && (
        <div className="pl-6 space-y-2">
          <SearchInput
            items={recipes}
            onSearch={setFilteredRecipes}
            placeholder={`搜索${title}...`}
            className="mb-2"
          />
          <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2">
            {filteredRecipes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                {searchQuery ? "没有找到匹配的食谱" : "没有可用的食谱"}
              </p>
            ) : (
              filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className={`flex items-center gap-2 p-1.5 rounded-md border cursor-pointer transition-colors ${
                    selectedRecipes.includes(recipe.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => onSelect(recipe.id)}
                >
                  <Checkbox
                    checked={selectedRecipes.includes(recipe.id)}
                    onCheckedChange={() => onSelect(recipe.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{recipe.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 