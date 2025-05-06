'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { RecipeTag } from "@/lib/recipes";
import Link from "next/link";

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: RecipeTag[];
}

export interface RecipeFormProps {
  initialData: RecipeFormData;
  onSubmit: (data: RecipeFormData) => void;
  submitLabel: string;
  availableTags: readonly RecipeTag[];
  cancelHref: string;
}

export function RecipeForm({ initialData, onSubmit, submitLabel, availableTags, cancelHref }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>(initialData);
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>(initialData.tags || []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: selectedTags
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, '']
    });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">标题</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>标签</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableTags.map(tag => (
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
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>食材</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addIngredient}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加食材
          </Button>
        </div>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`食材 ${index + 1}`}
              required
            />
            {formData.ingredients.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeIngredient(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>步骤</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStep}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加步骤
          </Button>
        </div>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Textarea
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              placeholder={`步骤 ${index + 1}`}
              required
              rows={2}
            />
            {formData.steps.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeStep(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-end gap-4 mt-6">
        <Button variant="outline" asChild>
          <Link href={cancelHref}>取消</Link>
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
} 