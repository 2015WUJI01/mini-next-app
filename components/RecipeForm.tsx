'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

export type RecipeFormData = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
};

interface RecipeFormProps {
  initialData?: RecipeFormData;
  onSubmit: (data: RecipeFormData) => void;
  submitLabel?: string;
}

export function RecipeForm({ 
  initialData = { title: '', description: '', ingredients: [''], steps: [''] }, 
  onSubmit,
  submitLabel = '保存'
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [ingredients, setIngredients] = useState<string[]>(initialData.ingredients);
  const [steps, setSteps] = useState<string[]>(initialData.steps);
  
  // 当初始数据变化时更新状态
  useEffect(() => {
    setTitle(initialData.title);
    setDescription(initialData.description);
    setIngredients(initialData.ingredients);
    setSteps(initialData.steps);
  }, [initialData]);
  
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };
  
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  const addStep = () => {
    setSteps([...steps, ""]);
  };
  
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      ingredients,
      steps
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">食谱名称</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：番茄炒蛋" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">食谱描述</label>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简单描述这道菜的特点和口味..." 
          />
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
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeIngredient(index)}
                className="h-8 w-8"
              >
                ×
              </Button>
            </div>
          ))}
          
          {ingredients.length === 0 && (
            <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
              暂无食材，点击"添加食材"按钮添加
            </div>
          )}
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
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-500">步骤 {index + 1}</label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeStep(index)}
                >
                  删除
                </Button>
              </div>
              <Textarea 
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder={`描述步骤 ${index + 1}`}
              />
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-sm text-gray-500 text-center p-4 border border-dashed rounded-md">
              暂无步骤，点击"添加步骤"按钮添加
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full">{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
} 