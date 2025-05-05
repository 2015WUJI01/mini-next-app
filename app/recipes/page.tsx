'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { useState } from "react";

// 示例数据
const exampleRecipes = [
  {
    id: "1",
    title: "番茄炒蛋",
    description: "一道经典的家常菜，酸甜可口，营养丰富",
    ingredientsCount: 4
  },
  {
    id: "2",
    title: "宫保鸡丁",
    description: "麻辣鲜香，搭配花生和黄瓜，口感丰富多样",
    ingredientsCount: 8
  },
  {
    id: "3",
    title: "红烧肉",
    description: "肥而不腻，入口即化，香气四溢的传统美食",
    ingredientsCount: 6
  }
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState(exampleRecipes);
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的食谱</h1>
        <Button asChild>
          <Link href="/recipes/new">添加新食谱</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              ingredientsCount={recipe.ingredientsCount}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">暂无食谱，请添加新食谱</p>
          </div>
        )}
      </div>
    </div>
  );
} 