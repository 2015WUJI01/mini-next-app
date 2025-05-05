import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  ingredientsCount: number;
}

export function RecipeCard({ id, title, description, ingredientsCount }: RecipeCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500">{ingredientsCount} 种食材</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/recipes/${id}`}>查看详情</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/recipes/${id}/edit`}>编辑</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 