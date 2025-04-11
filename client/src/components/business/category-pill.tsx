import React from "react";
import { cn } from "@/lib/utils";

interface CategoryPillProps {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryPill({ 
  name, 
  isSelected = false, 
  onClick 
}: CategoryPillProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
        isSelected 
          ? "bg-primary text-white" 
          : "bg-white text-neutral-500 hover:bg-neutral-100"
      )}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
