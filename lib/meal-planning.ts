import { Recipe } from './recipes';

// 饮食计划类型
export interface MealPlan {
  date: string; // ISO 日期格式 YYYY-MM-DD
  breakfast?: string; // 食谱ID
  lunch?: string; // 食谱ID
  dinner?: string; // 食谱ID
}

// 饮食计划服务
export class MealPlanningService {
  private static instance: MealPlanningService;
  private mealPlans: Record<string, MealPlan>; // 以日期为键

  private constructor() {
    // 从本地存储加载饮食计划
    const savedMealPlans = typeof window !== 'undefined'
      ? localStorage.getItem('mealPlans')
      : null;

    this.mealPlans = savedMealPlans 
      ? JSON.parse(savedMealPlans) 
      : {};
  }

  public static getInstance(): MealPlanningService {
    if (!MealPlanningService.instance) {
      MealPlanningService.instance = new MealPlanningService();
    }
    return MealPlanningService.instance;
  }

  // 获取指定月份的所有饮食计划
  public getMealPlansByMonth(year: number, month: number): MealPlan[] {
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    
    return Object.entries(this.mealPlans)
      .filter(([date]) => date.startsWith(prefix))
      .map(([_, plan]) => plan);
  }

  // 获取指定日期的饮食计划
  public getMealPlanByDate(date: string): MealPlan | null {
    return this.mealPlans[date] || null;
  }

  // 设置指定日期的饮食计划
  public setMealPlan(date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string | null): MealPlan {
    // 如果不存在该日期的计划，先创建
    if (!this.mealPlans[date]) {
      this.mealPlans[date] = { date };
    }

    // 设置或移除食谱
    if (recipeId) {
      this.mealPlans[date] = {
        ...this.mealPlans[date],
        [mealType]: recipeId
      };
    } else {
      // 如果recipeId为null，则移除该餐食计划
      const { [mealType]: _, ...rest } = this.mealPlans[date];
      this.mealPlans[date] = { ...rest };

      // 如果移除后该日期没有任何餐食计划，则删除整个日期
      if (!this.mealPlans[date].breakfast && !this.mealPlans[date].lunch && !this.mealPlans[date].dinner) {
        const { [date]: _, ...remaining } = this.mealPlans;
        this.mealPlans = remaining;
      }
    }

    this.saveToLocalStorage();
    return this.mealPlans[date] || { date };
  }

  // 清除指定日期的所有饮食计划
  public clearMealPlan(date: string): boolean {
    if (!this.mealPlans[date]) return false;
    
    const { [date]: _, ...remaining } = this.mealPlans;
    this.mealPlans = remaining;
    this.saveToLocalStorage();
    return true;
  }

  // 保存到本地存储
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mealPlans', JSON.stringify(this.mealPlans));
    }
  }
}

// 导出单例实例
export const mealPlanningService = typeof window !== 'undefined'
  ? MealPlanningService.getInstance()
  : null; 