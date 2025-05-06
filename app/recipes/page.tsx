'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeSearch } from "@/components/RecipeSearch";
import { useState, useEffect } from "react";
import { recipeService, Recipe, RECIPE_TAGS, RecipeTag } from "@/lib/recipes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, FileUp, FileDown } from "lucide-react";
import { toast } from "sonner";

interface RecipeCardItem {
  id: string;
  title: string;
  description: string;
  ingredientsCount: number;
  tags?: string[];
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<RecipeCardItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    const allRecipes = recipeService?.getAllRecipes() || [];
    const formattedRecipes = allRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || "",
      ingredientsCount: recipe.ingredients.length,
      tags: recipe.tags
    }));
    setRecipes(formattedRecipes);
    setIsLoading(false);
  };

  const handleDeleteRecipe = (id: string) => {
    if (recipeService?.deleteRecipe(id)) {
      loadRecipes();
      toast.success("食谱已删除");
    }
  };

  const handleExport = () => {
    const data = recipeService?.exportRecipes();
    if (!data) return;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recipes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("食谱数据已导出");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      if (recipeService?.importRecipes(data)) {
        toast.success("食谱数据已导入");
        loadRecipes();
      } else {
        toast.error("导入失败：数据格式不正确");
      }
    };
    reader.readAsText(file);
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    if (!recipeService) return;
    const allRecipes = recipeService.getAllRecipes();
    if (!term.trim() && selectedTags.length === 0) {
      const formattedRecipes = allRecipes.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description || "",
        ingredientsCount: recipe.ingredients.length,
        tags: recipe.tags
      }));
      setRecipes(formattedRecipes);
      return;
    }
    const filteredRecipes = allRecipes.filter(recipe => {
      const matchesSearch = term.trim() === "" || 
        recipe.title.toLowerCase().includes(term.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(term.toLowerCase()) ||
        recipe.ingredients.some(ingredient => 
          typeof ingredient === 'string' 
            ? ingredient.toLowerCase().includes(term.toLowerCase())
            : ingredient.name.toLowerCase().includes(term.toLowerCase())
        );
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => recipe.tags?.includes(tag));
      return matchesSearch && matchesTags;
    });
    const formattedRecipes = filteredRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || "",
      ingredientsCount: recipe.ingredients.length,
      tags: recipe.tags
    }));
    setRecipes(formattedRecipes);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">食谱管理</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            导出
          </Button>
          <label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="outline" asChild>
              <span>
                <FileUp className="w-4 h-4 mr-2" />
                导入
              </span>
            </Button>
          </label>
          <Button asChild>
            <Link href="/recipes/new">
              <Plus className="w-4 h-4 mr-2" />
              添加食谱
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <Input
          placeholder="搜索食谱..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {RECIPE_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setSelectedTags(prev =>
                  prev.includes(tag)
                    ? prev.filter(t => t !== tag)
                    : [...prev, tag]
                );
                handleSearch(searchQuery);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              
                <RecipeCard
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  ingredientsCount={recipe.ingredientsCount}
                  tags={recipe.tags}
                />
            ))
          ) : (
            <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg col-span-full">
              <p className="text-gray-500">
                {searchQuery || selectedTags.length > 0 
                  ? `没有找到匹配的食谱` 
                  : '暂无食谱，请添加新食谱'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 