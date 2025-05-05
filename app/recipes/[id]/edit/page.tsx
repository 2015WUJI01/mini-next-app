'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";
import { recipeService, Recipe } from "@/lib/recipes";
import { toast } from "@/components/ui/use-toast";

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
          description: recipe.description,
          ingredients: recipe.ingredients || [],
          steps: recipe.steps || []
        });
      }
      setIsLoading(false);
    }
  }, [id]);
  
  const handleSubmit = (data: RecipeFormData) => {
    if (!recipeService) {
      toast({
        title: "更新失败",
        description: "服务不可用，请稍后重试",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // 使用RecipeService更新数据
      const updatedRecipe = recipeService.updateRecipe(id, data);
      
      if (updatedRecipe) {
        toast({
          title: "更新成功",
          description: `食谱"${updatedRecipe.title}"已成功更新`
        });
        
        // 更新成功后重定向到详情页
        router.push(`/recipes/${id}`);
      } else {
        throw new Error("未找到要更新的食谱");
      }
    } catch (error: any) {
      console.error('更新食谱失败:', error);
      toast({
        title: "更新失败",
        description: error.message || "无法更新食谱，请稍后重试",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }
  
  if (!recipeData) {
    return (
      <div className="container mx-auto py-10">
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
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
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
          />
        </CardContent>
        <CardFooter className="flex justify-start">
          <Button variant="outline" asChild>
            <Link href={`/recipes/${id}`}>取消</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 