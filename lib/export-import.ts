// 导入导出功能
import { RecipeService } from './recipes';
import { MealPlanningService } from './meal-planning';

export interface ExportData {
  recipes: Record<string, any>;
  mealPlans: Record<string, any>;
  exportDate: string;
  version: string;
}

export class ExportImportService {
  private static instance: ExportImportService;
  private recipeService: RecipeService | null = null;
  private mealPlanningService: MealPlanningService | null = null;
  
  private constructor() {
    // 确保只在客户端运行时才实例化服务
    if (typeof window !== 'undefined') {
      this.recipeService = RecipeService.getInstance();
      this.mealPlanningService = MealPlanningService.getInstance();
    }
  }
  
  public static getInstance(): ExportImportService {
    if (!ExportImportService.instance) {
      ExportImportService.instance = new ExportImportService();
    }
    return ExportImportService.instance;
  }
  
  // 导出所有数据
  public exportAllData(): ExportData {
    // 确保我们是在客户端
    if (typeof window === 'undefined') {
      throw new Error('导出功能只能在客户端使用');
    }
    
    // 获取所有食谱数据（从localStorage）
    const recipesData = localStorage.getItem('recipes') || '{}';
    
    // 获取所有饮食计划数据（从localStorage）
    const mealPlansData = localStorage.getItem('mealPlans') || '{}';
    
    const exportData: ExportData = {
      recipes: JSON.parse(recipesData),
      mealPlans: JSON.parse(mealPlansData),
      exportDate: new Date().toISOString(),
      version: '1.0.0' // 版本号，用于后续兼容性处理
    };
    
    return exportData;
  }
  
  // 将数据导出为文件
  public exportToFile(filename: string = 'recipe-meal-data.json'): void {
    try {
      const exportData = this.exportAllData();
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      // 创建一个下载链接
      const exportFileAnchor = document.createElement('a');
      exportFileAnchor.setAttribute('href', dataUri);
      exportFileAnchor.setAttribute('download', filename);
      exportFileAnchor.style.display = 'none';
      
      // 添加到文档并触发点击
      document.body.appendChild(exportFileAnchor);
      exportFileAnchor.click();
      
      // 清理DOM
      document.body.removeChild(exportFileAnchor);
    } catch (error: any) {
      console.error('导出数据时发生错误:', error);
      throw new Error(`导出数据失败: ${error.message}`);
    }
  }
  
  // 导入数据
  public async importFromFile(file: File): Promise<boolean> {
    try {
      return new Promise<boolean>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            if (!event.target || event.target.result === null) {
              reject(new Error('读取文件内容失败'));
              return;
            }
            
            const importData = JSON.parse(event.target.result as string) as ExportData;
            
            // 检查数据版本和结构
            if (!this.validateImportData(importData)) {
              reject(new Error('导入的数据格式无效或不兼容'));
              return;
            }
            
            // 保存食谱数据
            localStorage.setItem('recipes', JSON.stringify(importData.recipes));
            
            // 保存饮食计划数据
            localStorage.setItem('mealPlans', JSON.stringify(importData.mealPlans));
            
            // 刷新数据服务
            this.refreshServices();
            
            resolve(true);
          } catch (error: any) {
            reject(new Error(`解析导入数据时出错: ${error.message}`));
          }
        };
        
        reader.onerror = () => {
          reject(new Error('读取文件时发生错误'));
        };
        
        reader.readAsText(file);
      });
    } catch (error: any) {
      console.error('导入数据时发生错误:', error);
      throw error;
    }
  }
  
  // 验证导入的数据结构
  private validateImportData(data: any): boolean {
    // 基本结构验证
    if (!data || typeof data !== 'object') return false;
    if (!data.recipes || !data.mealPlans || !data.version) return false;
    
    // 版本兼容性检查（可根据需要扩展）
    const currentVersion = '1.0.0';
    if (data.version !== currentVersion) {
      console.warn(`导入数据版本(${data.version})与当前版本(${currentVersion})不同，可能需要迁移`);
      // 这里可以添加版本迁移逻辑
    }
    
    return true;
  }
  
  // 刷新服务实例，以便重新加载导入的数据
  private refreshServices(): void {
    // 强制重新创建服务实例
    // 注意：这种方法依赖于服务的实现方式，可能需要调整
    (RecipeService as any).instance = null;
    (MealPlanningService as any).instance = null;
    
    // 重新获取实例
    this.recipeService = RecipeService.getInstance();
    this.mealPlanningService = MealPlanningService.getInstance();
  }
}

// 导出单例实例
export const exportImportService = typeof window !== 'undefined'
  ? ExportImportService.getInstance()
  : null; 