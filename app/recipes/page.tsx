'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSearch } from "@/components/RecipeSearch";
import { useState, useEffect } from "react";
import { recipeService, Recipe } from "@/lib/recipes";

interface RecipeCardItem {
  id: string;
  title: string;
  description: string;
  ingredientsCount: number;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCardItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // 加载数据
  useEffect(() => {
    if (typeof window !== 'undefined' && recipeService) {
      const allRecipes = recipeService.getAllRecipes();
      const formattedRecipes = allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredientsCount: recipe.ingredients.length
      }));
      setRecipes(formattedRecipes);
      setIsLoading(false);
    }
  }, []);
  
  // 搜索功能
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!recipeService) return;
    
    const allRecipes = recipeService.getAllRecipes();
    
    if (!term.trim()) {
      // 如果搜索词为空，显示所有食谱
      const formattedRecipes = allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredientsCount: recipe.ingredients.length
      }));
      setRecipes(formattedRecipes);
      return;
    }
    
    // 过滤包含搜索词的食谱
    const filteredRecipes = allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(term.toLowerCase()) ||
      recipe.description.toLowerCase().includes(term.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(term.toLowerCase())
      )
    );
    
    const formattedRecipes = filteredRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredientsCount: recipe.ingredients.length
    }));
    
    setRecipes(formattedRecipes);
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">我的食谱</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <RecipeSearch onSearch={handleSearch} />
          <Button asChild>
            <Link href="/recipes/new">添加新食谱</Link>
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
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
            <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg col-span-full">
              <p className="text-gray-500">
                {searchTerm ? `没有找到包含"${searchTerm}"的食谱` : '暂无食谱，请添加新食谱'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
} 