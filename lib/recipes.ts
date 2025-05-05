// 食谱类型定义
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
}

// 初始示例数据
const initialRecipes: Record<string, Recipe> = {
  "1": {
    id: "1",
    title: "番茄炒蛋",
    description: "一道经典的家常菜，酸甜可口，营养丰富",
    ingredients: ["鸡蛋 4个", "番茄 2个", "葱花 适量", "盐 适量"],
    steps: [
      "番茄洗净切块",
      "鸡蛋打散加少许盐",
      "锅中放油，倒入鸡蛋炒至金黄",
      "将鸡蛋盛出，锅中加少量油，放入番茄翻炒出汁",
      "放入适量盐调味",
      "倒入炒好的鸡蛋，均匀翻炒",
      "撒上葱花即可出锅"
    ]
  },
  "2": {
    id: "2",
    title: "宫保鸡丁",
    description: "麻辣鲜香，搭配花生和黄瓜，口感丰富多样",
    ingredients: ["鸡胸肉 300g", "黄瓜 1根", "花生 50g", "干辣椒 10个", "花椒 1小勺", "葱姜蒜 适量", "酱油 适量", "醋 适量", "糖 适量"],
    steps: [
      "鸡胸肉切丁，用盐、料酒、淀粉腌制10分钟",
      "黄瓜切丁，花生提前炒熟",
      "锅中放油，爆香花椒和干辣椒",
      "加入葱姜蒜炒出香味",
      "放入腌制好的鸡丁翻炒至变色",
      "加入黄瓜丁翻炒",
      "调入酱油、醋、糖调味",
      "最后加入炒熟的花生翻炒均匀即可"
    ]
  },
  "3": {
    id: "3",
    title: "红烧肉",
    description: "肥而不腻，入口即化，香气四溢的传统美食",
    ingredients: ["五花肉 500g", "姜片 适量", "葱段 适量", "八角 2个", "桂皮 1小块", "酱油 适量", "料酒 适量", "冰糖 适量"],
    steps: [
      "五花肉洗净切块，焯水去血沫",
      "锅中放油，放入冰糖炒至融化呈棕色",
      "放入肉块翻炒上色",
      "加入姜片、葱段、八角、桂皮",
      "倒入适量酱油和料酒",
      "加入没过肉的热水，大火烧开后转小火",
      "盖上锅盖炖煮40-60分钟",
      "开盖后大火收汁即可"
    ]
  }
};

// 在客户端存储食谱数据
export class RecipeService {
  private static instance: RecipeService;
  private recipes: Record<string, Recipe>;

  private constructor() {
    // 从本地存储加载食谱，如果没有则使用初始数据
    const savedRecipes = typeof window !== 'undefined' 
      ? localStorage.getItem('recipes')
      : null;
    
    this.recipes = savedRecipes 
      ? JSON.parse(savedRecipes) 
      : initialRecipes;
  }

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // 获取所有食谱
  public getAllRecipes(): Recipe[] {
    return Object.values(this.recipes);
  }

  // 获取单个食谱
  public getRecipe(id: string): Recipe | null {
    return this.recipes[id] || null;
  }

  // 添加新食谱
  public addRecipe(recipe: Omit<Recipe, 'id'>): Recipe {
    const id = Date.now().toString();
    const newRecipe = { ...recipe, id };
    this.recipes = {
      ...this.recipes,
      [id]: newRecipe
    };
    this.saveToLocalStorage();
    return newRecipe;
  }

  // 更新食谱
  public updateRecipe(id: string, recipe: Partial<Recipe>): Recipe | null {
    if (!this.recipes[id]) return null;
    
    this.recipes[id] = {
      ...this.recipes[id],
      ...recipe
    };
    this.saveToLocalStorage();
    return this.recipes[id];
  }

  // 删除食谱
  public deleteRecipe(id: string): boolean {
    if (!this.recipes[id]) return false;
    
    const { [id]: _, ...remaining } = this.recipes;
    this.recipes = remaining;
    this.saveToLocalStorage();
    return true;
  }

  // 保存到本地存储
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recipes', JSON.stringify(this.recipes));
    }
  }
}

// 导出单例实例
export const recipeService = typeof window !== 'undefined' 
  ? RecipeService.getInstance() 
  : null; 