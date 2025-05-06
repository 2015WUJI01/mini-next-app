import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  ingredientsCount: number;
  tags?: string[];
}

export function RecipeCard({ id, title, description, ingredientsCount, tags }: RecipeCardProps) {
  return (
    <Card className="shadow-md rounded-lg hover:shadow-lg transition-shadow duration-200 flex flex-col h-48">
      <CardHeader className="pb-1 flex flex-col gap-1 mb-2">
        <CardTitle className="text-lg font-bold truncate">{title}</CardTitle>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2 h-[2.5em]">{description}</p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{ingredientsCount} 种食材</span>
          <Button size="sm" variant="outline">
            <Link href={`/recipes/${id}`}>查看详情</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 