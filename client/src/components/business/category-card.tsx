import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { cn, getIconForCategory, getCategoryImage } from "@/lib/utils";

interface CategoryCardProps {
  id: number;
  name: string;
  icon: string;
  businessCount: number;
  colorIndex?: number;
}

export default function CategoryCard({ 
  id, 
  name, 
  icon, 
  businessCount,
  colorIndex = 0
}: CategoryCardProps) {
  // Color variants for the icon background
  const colorVariants = [
    "bg-primary/10 text-primary",
    "bg-secondary/10 text-secondary",
    "bg-amber-500/10 text-amber-500",
    "bg-red-500/10 text-red-500",
    "bg-green-500/10 text-green-500",
    "bg-purple-500/10 text-purple-500",
  ];
  
  const colorClass = colorVariants[colorIndex % colorVariants.length];
  
  return (
    <Link href={`/category/${id}`}>
      <Card className="bg-white rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-all cursor-pointer">
        <div className={cn("h-20 w-20 rounded-xl flex items-center justify-center mb-4", colorClass)}>
          <div 
            className="w-14 h-14"
            dangerouslySetInnerHTML={{ __html: getCategoryImage(name) }} 
          />
        </div>
        <h3 className="font-medium text-neutral-900">{name}</h3>
        <p className="text-xs text-neutral-500 mt-1">{businessCount} Businesses</p>
      </Card>
    </Link>
  );
}
