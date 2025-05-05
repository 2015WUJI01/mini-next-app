'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecipeForm, RecipeFormData } from "@/components/RecipeForm";

export default function NewRecipePage() {
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
    // 在实际应用中，这里会是一个API调用来保存数据
    console.log('新建食谱数据:', data);
    
    // 保存成功后重定向到食谱列表
    router.push('/recipes');
  };
  
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>创建新食谱</CardTitle>
          <CardDescription>记录你喜爱的菜肴制作步骤和所需食材</CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="保存食谱"
          />
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