'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { exportImportService } from '@/lib/export-import';
import { recipeService } from '@/lib/recipes';
import { mealPlanningService } from '@/lib/meal-planning';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataManagementPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportFilename, setExportFilename] = useState('recipe-meal-data.json');
  const [recipesCount, setRecipesCount] = useState<number>(0);
  const [mealPlansCount, setMealPlansCount] = useState<number>(0);
  const [localStorageSize, setLocalStorageSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 计算数据统计
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 获取食谱数量
      if (recipeService) {
        const recipes = recipeService.getAllRecipes();
        setRecipesCount(recipes.length);
      }

      // 获取饮食计划数量
      if (mealPlanningService) {
        // 由于没有直接获取所有meal plans的方法，我们估算一下
        // 获取当前月份的计划
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const plans = mealPlanningService.getMealPlansByMonth(currentYear, currentMonth);
        setMealPlansCount(plans.length);
      }

      // 估算本地存储大小
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          totalSize += key.length + value.length;
        }
      }
      // 转换为KB
      setLocalStorageSize(Math.round(totalSize / 1024 * 100) / 100);
    }
  }, []);

  // 处理导出
  const handleExport = () => {
    try {
      setIsExporting(true);
      
      if (!exportImportService) {
        throw new Error('导出服务不可用');
      }
      
      exportImportService.exportToFile(exportFilename);
      toast({
        title: '导出成功',
        description: '所有食谱和饮食安排数据已成功导出'
      });
    } catch (error: any) {
      console.error('导出数据失败:', error);
      toast({
        title: '导出失败',
        description: error.message || '无法导出数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 处理导入
  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: '请选择文件',
        description: '请先选择要导入的数据文件',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsImporting(true);
      
      if (!exportImportService) {
        throw new Error('导入服务不可用');
      }
      
      await exportImportService.importFromFile(selectedFile);
      
      toast({
        title: '导入成功',
        description: '所有食谱和饮食安排数据已成功导入'
      });
      
      // 刷新页面以显示导入的数据
      window.location.reload();
    } catch (error: any) {
      console.error('导入数据失败:', error);
      toast({
        title: '导入失败',
        description: error.message || '无法导入数据，请检查文件格式是否正确',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">数据管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>食谱</CardTitle>
            <CardDescription>当前保存的食谱数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{recipesCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>饮食计划</CardTitle>
            <CardDescription>当前月份的饮食计划数量</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{mealPlansCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>存储空间</CardTitle>
            <CardDescription>本地存储使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{localStorageSize} KB</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 导出数据 */}
        <Card>
          <CardHeader>
            <CardTitle>导出数据</CardTitle>
            <CardDescription>
              将所有食谱和饮食编排数据导出为文件保存
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="exportFilename" className="text-right">
                文件名
              </Label>
              <Input
                id="exportFilename"
                className="col-span-3"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? '导出中...' : '导出数据'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* 导入数据 */}
        <Card>
          <CardHeader>
            <CardTitle>导入数据</CardTitle>
            <CardDescription>
              从之前导出的文件中恢复数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="importFile" className="text-right">
                选择文件
              </Label>
              <Input
                id="importFile"
                type="file"
                accept=".json"
                ref={fileInputRef}
                className="col-span-3"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-500 truncate">
                已选择: {selectedFile.name}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!selectedFile || isImporting} className="w-full">
                  {isImporting ? '导入中...' : '导入数据'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认导入数据</AlertDialogTitle>
                  <AlertDialogDescription>
                    此操作将覆盖您当前的所有食谱和饮食编排数据。此操作不可撤销。确定要继续吗？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImport}>
                    确认导入
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h2 className="text-amber-800 font-semibold mb-2">数据存储说明</h2>
        <p className="text-amber-700 text-sm">
          所有数据都存储在浏览器的本地存储中，不会上传到任何服务器。
          清除浏览器数据会导致数据丢失。建议定期导出数据以防数据丢失。
        </p>
      </div>
    </>
  );
} 