'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";
import { recipeService, RECIPE_TAGS, RecipeTag } from "@/lib/recipes";
import { toast } from "sonner";

// 内部组件用于使用searchParams
function RecipeFormContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('name');
  
  const [initialData, setInitialData] = useState<RecipeFormData>({
    title: '',
    description: '',
    ingredients: [''],
    steps: [''],
    tags: []
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
      toast.error("服务不可用，请稍后重试");
      return;
    }
    
    try {
      // 使用RecipeService保存数据
      const newRecipe = recipeService.addRecipe(data);
      
      toast.success(`食谱"${newRecipe.title}"已成功保存`);
      
      // 保存成功后重定向到食谱详情页
      router.push(`/recipes/${newRecipe.id}`);
    } catch (error: any) {
      console.error('保存食谱失败:', error);
      toast.error(error.message || "无法保存食谱，请稍后重试");
    }
  };
  
  return (
    <RecipeForm
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="保存食谱"
      availableTags={RECIPE_TAGS}
      cancelHref="/recipes"
    />
  );
}

// 主页面组件
export default function NewRecipePage() {
  return (
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
    </Card>
  );
} 