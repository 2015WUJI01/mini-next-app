'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";

// 模拟数据库获取的食谱详情
const recipeDetails = {
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

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  
  const [recipeData, setRecipeData] = useState<RecipeFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 在实际应用中，这里会是一个API调用
    if (id && typeof id === 'string') {
      const recipe = recipeDetails[id as keyof typeof recipeDetails];
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
    // 在实际应用中，这里会是一个API调用来更新数据
    console.log('更新的食谱数据:', {
      id,
      ...data
    });
    
    // 更新成功后重定向到详情页
    router.push(`/recipes/${id}`);
  };
  
  if (isLoading || !recipeData) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">加载中...</p>
        </div>
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