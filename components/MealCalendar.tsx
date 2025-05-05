'use client';

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { format, parseISO, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Recipe, recipeService } from '@/lib/recipes';
import { MealPlan, mealPlanningService } from '@/lib/meal-planning';

export function MealCalendar() {
  const [date, setDate] = useState<Date>(new Date());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);
  
  // 加载食谱数据
  useEffect(() => {
    if (recipeService) {
      setRecipes(recipeService.getAllRecipes());
    }
  }, []);
  
  // 选择日期时加载饮食计划
  const handleSelect = (day: Date | undefined) => {
    if (!day || !mealPlanningService) return;
    
    setSelectedDate(day);
    const dateStr = format(day, 'yyyy-MM-dd');
    const plan = mealPlanningService.getMealPlanByDate(dateStr);
    setSelectedMealPlan(plan || { date: dateStr });
  };
  
  // 添加食谱到指定餐食
  const assignRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string) => {
    if (!selectedDate || !mealPlanningService) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const updatedPlan = mealPlanningService.setMealPlan(dateStr, mealType, recipeId);
    setSelectedMealPlan(updatedPlan);
  };
  
  // 移除食谱
  const removeRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!selectedDate || !mealPlanningService) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const updatedPlan = mealPlanningService.setMealPlan(dateStr, mealType, null);
    setSelectedMealPlan(updatedPlan);
  };
  
  // 获取指定餐食的食谱详情
  const getMealRecipe = (mealType: 'breakfast' | 'lunch' | 'dinner'): Recipe | null => {
    if (!selectedMealPlan || !selectedMealPlan[mealType] || !recipeService) return null;
    
    // 获取mealType对应的value，可能是字符串或字符串数组
    const mealValue = selectedMealPlan[mealType];
    
    // 如果是数组，取第一个元素；如果是字符串，直接使用
    const recipeId = Array.isArray(mealValue) ? mealValue[0] : mealValue;
    
    // 确保recipeId存在
    if (!recipeId) return null;
    
    return recipeService.getRecipe(recipeId);
  };
  
  // 自定义日历日期渲染
  const renderDay = (day: Date) => {
    if (!mealPlanningService) return null;
    
    const dateStr = format(day, 'yyyy-MM-dd');
    const plan = mealPlanningService.getMealPlanByDate(dateStr);
    
    const hasMeals = plan && (plan.breakfast || plan.lunch || plan.dinner);
    
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center ${
        hasMeals ? 'font-bold' : ''
      }`}>
        {day.getDate()}
        
        {hasMeals && (
          <div className="flex mt-1 space-x-1">
            {plan?.breakfast && <div className="w-2 h-2 bg-red-500 rounded-full" />}
            {plan?.lunch && <div className="w-2 h-2 bg-green-500 rounded-full" />}
            {plan?.dinner && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate || undefined}
        onSelect={handleSelect}
        locale={zhCN}
        className="rounded-md border shadow"
      />
      
      {selectedDate && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-3">
              {format(selectedDate, 'yyyy年MM月dd日')} 饮食安排
            </h3>
            
            <div className="space-y-4">
              <MealSection 
                title="早餐" 
                mealType="breakfast"
                recipe={getMealRecipe('breakfast')}
                recipes={recipes}
                onAssign={(recipeId) => assignRecipe('breakfast', recipeId)}
                onRemove={() => removeRecipe('breakfast')}
              />
              
              <MealSection 
                title="午餐" 
                mealType="lunch"
                recipe={getMealRecipe('lunch')}
                recipes={recipes}
                onAssign={(recipeId) => assignRecipe('lunch', recipeId)}
                onRemove={() => removeRecipe('lunch')}
              />
              
              <MealSection 
                title="晚餐" 
                mealType="dinner"
                recipe={getMealRecipe('dinner')}
                recipes={recipes}
                onAssign={(recipeId) => assignRecipe('dinner', recipeId)}
                onRemove={() => removeRecipe('dinner')}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 单餐区域组件
interface MealSectionProps {
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  recipe: Recipe | null;
  recipes: Recipe[];
  onAssign: (recipeId: string) => void;
  onRemove: () => void;
}

function MealSection({ title, mealType, recipe, recipes, onAssign, onRemove }: MealSectionProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium">{title}</h4>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              {recipe ? '更换食谱' : '添加食谱'}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>选择{title}食谱</SheetTitle>
              <SheetDescription>
                从你的食谱库中选择一个食谱作为{title}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {recipes.map(item => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => {
                    onAssign(item.id);
                    // 关闭抽屉
                    const closeButton = document.querySelector('button[data-state="open"]') as HTMLButtonElement;
                    closeButton?.click();
                  }}
                >
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.ingredients.length} 种食材</div>
                  </div>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {recipe ? (
        <div className="space-y-2">
          <div className="text-sm font-medium">{recipe.title}</div>
          <div className="text-xs text-gray-500">{recipe.description}</div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={onRemove}>
              移除
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-center text-gray-400 text-sm">
          暂未安排食谱
        </div>
      )}
    </div>
  );
} 