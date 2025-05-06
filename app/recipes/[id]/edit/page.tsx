'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";
import { recipeService, RECIPE_TAGS, RecipeTag } from "@/lib/recipes";
import { toast } from "sonner";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  
  const [recipeData, setRecipeData] = useState<RecipeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && recipeService && id) {
      const recipe = recipeService.getRecipe(id);
      if (recipe) {
        setRecipeData({
          title: recipe.title,
          description: recipe.description || '',
          ingredients: recipe.ingredients.map(ing => 
            typeof ing === 'string' ? ing : `${ing.name} ${ing.amount}`
          ),
          steps: recipe.steps || [''],
          tags: (recipe.tags || []) as RecipeTag[]
        });
      }
      setIsLoading(false);
    }
  }, [id]);
  
  const handleSubmit = (data: RecipeFormData) => {
    if (!recipeService) {
      toast.error("服务不可用，请稍后重试");
      return;
    }
    
    try {
      // 使用RecipeService更新数据
      const updatedRecipe = recipeService.updateRecipe(id, data);
      
      if (updatedRecipe) {
        toast.success(`食谱"${updatedRecipe.title}"已成功更新`);
        
        // 更新成功后重定向到详情页
        router.push(`/recipes/${id}`);
      } else {
        throw new Error("未找到要更新的食谱");
      }
    } catch (error: any) {
      console.error('更新食谱失败:', error);
      toast.error(error.message || "无法更新食谱，请稍后重试");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  
  if (!recipeData) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-gray-500 mb-4">未找到该食谱</p>
            <Button asChild>
              <Link href="/recipes">返回食谱列表</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>编辑食谱</CardTitle>
        <CardDescription>修改你的食谱信息</CardDescription>
      </CardHeader>
      <CardContent>
        <RecipeForm 
          initialData={recipeData}
          onSubmit={handleSubmit}
          submitLabel="保存修改"
          availableTags={RECIPE_TAGS}
          cancelHref={`/recipes/${id}`}
        />
      </CardContent>
    </Card>
  );
} 