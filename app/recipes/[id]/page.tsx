'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { recipeService, Recipe } from "@/lib/recipes";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && recipeService && id && typeof id === 'string') {
      const fetchedRecipe = recipeService.getRecipe(id);
      setRecipe(fetchedRecipe);
      setIsLoading(false);
    }
  }, [id]);
  
  const handleDelete = () => {
    if (!recipeService || !id || typeof id !== 'string') return;
    
    const success = recipeService.deleteRecipe(id);
    
    if (success) {
      toast({
        title: "删除成功",
        description: "食谱已成功删除",
      });
      router.push('/recipes');
    } else {
      toast({
        title: "删除失败",
        description: "无法删除食谱，请稍后重试",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }
  
  if (!recipe) {
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{recipe.title}</CardTitle>
            <CardDescription className="mt-2">{recipe.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/recipes/${recipe.id}/edit`}>编辑</Link>
            </Button>
            
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">删除</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    确定要删除食谱"{recipe.title}"吗？此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">食材</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {typeof ingredient === 'string'
                  ? ingredient
                  : `${ingredient.name} ${ingredient.amount}`}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">烹饪步骤</h3>
          <ol className="list-decimal pl-5 space-y-4">
            {recipe.steps.map((step: string, index: number) => (
              <li key={index} className="text-gray-700">
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href="/recipes">返回食谱列表</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 