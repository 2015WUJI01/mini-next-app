'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// 示例菜谱别名映射表
const recipeAliases: Record<string, string> = {
  // 原名 -> ID 映射
  "番茄炒蛋": "1",
  "宫保鸡丁": "2",
  "红烧肉": "3",
  
  // 别名 -> ID 映射
  "西红柿炒鸡蛋": "1",
  "西红柿炒蛋": "1",
  "番茄炒鸡蛋": "1",
  "鸡丁": "2",
  "宫保鸡": "2",
  "东坡肉": "3"
};

export default function RecipeRedirectPage() {
  const router = useRouter();
  const { name } = useParams() as { name: string };
  
  useEffect(() => {
    // 解码URL中的中文名称
    const decodedName = decodeURIComponent(name);
    
    // 检查是否有匹配的菜谱
    if (recipeAliases[decodedName]) {
      // 如果匹配到菜谱，重定向到该菜谱的详情页
      router.push(`/recipes/${recipeAliases[decodedName]}`);
    } else {
      // 如果没有匹配到菜谱，重定向到新建菜谱页面，并传递菜谱名称
      router.push(`/recipes/new?name=${encodeURIComponent(decodedName)}`);
    }
  }, [name, router]);
  
  return (
    <div className="container mx-auto py-10 flex justify-center items-center">
      <p className="text-gray-500">正在加载菜谱信息...</p>
    </div>
  );
} 