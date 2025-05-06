'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RECIPE_TAGS } from '@/lib/recipes';

interface RecipeSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export function RecipeSearch({ searchQuery, onSearchChange, selectedTags, onTagSelect }: RecipeSearchProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="搜索菜谱..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {RECIPE_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
} 