"use client";
import React, { RefObject, useEffect, useRef } from "react";
import { Title } from "./title";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import { useIntersection } from "react-use";
import { useCategoryStore } from "@/shared/store/category";
import { ProductWithVariantsAndIngredients } from "@/@types";

type Props = {
  className?: string;
  items: ProductWithVariantsAndIngredients[];
  title: string;
  listClassname?: string;
  categoryId: number;
};

export function ProductsGroupList({
  categoryId,
  items,
  title,
  className,
}: Props) {
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const intersectionRef = useRef<null | HTMLDivElement>(null);

  const intersection = useIntersection(
    intersectionRef as RefObject<HTMLElement>,
    {
      threshold: 0.4,
    },
  );

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryId(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, title, setActiveCategoryId]);
  return (
    <div className={cn(className)} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" />
      <div
        className={cn(
          "grid grid-rows-1 gap-17.5 grid-col-1 md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {items?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            imageUrl={product.imageUrl}
            price={product?.variants[0]?.price}
            ingredients={product.ingredients}
          />
        ))}
      </div>
    </div>
  );
}
