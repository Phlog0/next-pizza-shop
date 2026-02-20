"use client";
import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/shared/store/category";
import { Button } from "../ui";
import { CategoryWithVariantsAndIngredients } from "../../../@types";

export function Categories({
  className,
  categories,
}: {
  className?: string;
  categories: CategoryWithVariantsAndIngredients[];
}) {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  return (
    <div className={cn("inline-flex gap-3 bg-gray-50 rounded-2xl", className)}>
      {categories.map((category, index) => (
        <Button
          key={index}
          disabled={category.products.length > 0 ? false : true}
          className="p-0"
        >
          <a
            className={cn(
              "flex items-center justify-center font-bold px-10 h-10 rounded-[8px] cursor-pointer w-full",
              categoryActiveId === category.id && "text-primary bg-orange-200",
            )}
            href={`/#${category.title}`}
          >
            {category.title}
          </a>
        </Button>
      ))}
    </div>
  );
}
