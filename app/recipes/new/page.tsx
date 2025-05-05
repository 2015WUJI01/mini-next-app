'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";
import { recipeService } from "@/lib/recipes";
import { toast } from "@/components/ui/use-toast";

// 内部组件用于使用searchParams
function RecipeFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  
  const [initialData, setInitialData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    steps: ['']
  });
  
  // 当URL中有name参数时，自动填充到表单中
  useEffect(() => {
    if (nameParam) {
      setInitialData(prev => ({
        ...prev,
        title: nameParam
      }));
    }
  }, [nameParam]);
  
  const handleSubmit = (data: RecipeFormData) => {
    if (!recipeService) {
      toast({
        title: "保存失败",
        description: "服务不可用，请稍后重试",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // 使用RecipeService保存数据
      const newRecipe = recipeService.addRecipe(data);
      
      toast({
        title: "保存成功",
        description: `食谱"${newRecipe.title}"已成功保存`
      });
      
      // 保存成功后重定向到食谱详情页
      router.push(`/recipes/${newRecipe.id}`);
    } catch (error: any) {
      console.error('保存食谱失败:', error);
      toast({
        title: "保存失败",
        description: error.message || "无法保存食谱，请稍后重试",
        variant: "destructive"
      });
    }
  };
  
  return (
    <RecipeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="保存食谱"
    />
  );
}

// 主页面组件
export default function NewRecipePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>创建新食谱</CardTitle>
          <CardDescription>记录你喜爱的菜肴制作步骤和所需食材</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>加载中...</div>}>
            <RecipeFormContainer />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-start">
          <Button variant="outline" asChild>
            <Link href="/recipes">取消</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 