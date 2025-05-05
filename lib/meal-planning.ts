import { Recipe } from './recipes';

// 饮食计划类型
export interface MealPlan {
  date: string; // ISO 日期格式 YYYY-MM-DD
  breakfast?: string[] | string; // 食谱ID数组或单个ID（兼容旧数据）
  lunch?: string[] | string; // 食谱ID数组或单个ID（兼容旧数据）
  dinner?: string[] | string; // 食谱ID数组或单个ID（兼容旧数据）
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
    
    // 兼容处理：将旧数据（单个ID）转换为新数据结构（数组）
    this.migrateOldData();
  }

  // 将旧数据格式（单个ID）转换为新数据结构（数组）
  private migrateOldData(): void {
    Object.keys(this.mealPlans).forEach(date => {
      const plan = this.mealPlans[date];
      
      // 转换早餐数据
      if (plan.breakfast && typeof plan.breakfast === 'string') {
        plan.breakfast = [plan.breakfast];
      } else if (!plan.breakfast) {
        plan.breakfast = [];
      }
      
      // 转换午餐数据
      if (plan.lunch && typeof plan.lunch === 'string') {
        plan.lunch = [plan.lunch];
      } else if (!plan.lunch) {
        plan.lunch = [];
      }
      
      // 转换晚餐数据
      if (plan.dinner && typeof plan.dinner === 'string') {
        plan.dinner = [plan.dinner];
      } else if (!plan.dinner) {
        plan.dinner = [];
      }
    });
    
    this.saveToLocalStorage();
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
  
  // 确保时段数据是数组类型
  private ensureArray(value: string[] | string | undefined): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  // 添加食谱到指定日期和时段
  public addRecipeToMeal(date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string): MealPlan {
    // 如果不存在该日期的计划，先创建
    if (!this.mealPlans[date]) {
      this.mealPlans[date] = { 
        date,
        breakfast: [],
        lunch: [],
        dinner: []
      };
    }
    
    // 确保当前属性是数组
    const currentMeals = this.ensureArray(this.mealPlans[date][mealType]);
    
    // 如果食谱不在当前时段，则添加
    if (!currentMeals.includes(recipeId)) {
      this.mealPlans[date] = {
        ...this.mealPlans[date],
        [mealType]: [...currentMeals, recipeId]
      };
      
      this.saveToLocalStorage();
    }
    
    return this.mealPlans[date];
  }

  // 从指定日期和时段移除食谱
  public removeRecipeFromMeal(date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string): MealPlan {
    if (!this.mealPlans[date]) {
      return { date };
    }
    
    // 确保当前属性是数组
    const currentMeals = this.ensureArray(this.mealPlans[date][mealType]);
    
    // 移除指定食谱
    const updatedMeals = currentMeals.filter(id => id !== recipeId);
    
    this.mealPlans[date] = {
      ...this.mealPlans[date],
      [mealType]: updatedMeals
    };
    
    // 如果所有时段都是空数组，则删除整个日期
    if (
      this.ensureArray(this.mealPlans[date].breakfast).length === 0 &&
      this.ensureArray(this.mealPlans[date].lunch).length === 0 &&
      this.ensureArray(this.mealPlans[date].dinner).length === 0
    ) {
      const { [date]: _, ...remaining } = this.mealPlans;
      this.mealPlans = remaining;
    }
    
    this.saveToLocalStorage();
    return this.mealPlans[date] || { date };
  }

  // 设置指定日期的饮食计划（兼容旧API，可以替换整个时段）
  public setMealPlan(date: string, mealType: 'breakfast' | 'lunch' | 'dinner', recipeId: string | null): MealPlan {
    // 如果不存在该日期的计划，先创建
    if (!this.mealPlans[date]) {
      this.mealPlans[date] = { 
        date,
        breakfast: [],
        lunch: [],
        dinner: []
      };
    }

    // 设置或移除食谱
    if (recipeId) {
      this.mealPlans[date] = {
        ...this.mealPlans[date],
        [mealType]: [recipeId] // 替换为只包含当前食谱的数组
      };
    } else {
      // 如果recipeId为null，则清空该时段
      this.mealPlans[date] = {
        ...this.mealPlans[date],
        [mealType]: []
      };

      // 如果所有时段都是空数组，则删除整个日期
      if (
        this.ensureArray(this.mealPlans[date].breakfast).length === 0 &&
        this.ensureArray(this.mealPlans[date].lunch).length === 0 &&
        this.ensureArray(this.mealPlans[date].dinner).length === 0
      ) {
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