'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewRecipePage() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };
  
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  
  const addStep = () => {
    setSteps([...steps, ""]);
  };
  
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里将添加保存到后端或本地存储的逻辑
    // 现在我们只是简单地导航回食谱列表
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
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">食谱名称</label>
                <Input placeholder="例如：番茄炒蛋" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">食谱描述</label>
                <Textarea placeholder="简单描述这道菜的特点和口味..." />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">食材清单</label>
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                    添加食材
                  </Button>
                </div>
                
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      placeholder={`食材 ${index + 1}, 例如：2个鸡蛋`}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">制作步骤</label>
                  <Button type="button" variant="outline" size="sm" onClick={addStep}>
                    添加步骤
                  </Button>
                </div>
                
                {steps.map((step, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm text-gray-500">步骤 {index + 1}</label>
                    <Textarea 
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`描述步骤 ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/recipes">取消</Link>
          </Button>
          <Button type="submit" onClick={handleSubmit}>保存食谱</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 