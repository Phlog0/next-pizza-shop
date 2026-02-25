import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { Ingredient } from "@/generated/prisma/client";

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  ingredients: Ingredient[];
  className?: string;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  className,
  id,
  imageUrl,
  price,
  title,
  ingredients,
}) => {
  //FIXME <img className="w-[215px] h-[215px]
  return (
    <div className={cn(className, "bg-gray-50 overflow-hidden")}>
      <Link scroll={false} href={`product/${id}`}>
        <div className="flex justify-center bg-secondary rounded-lg">
          <img
            className="w-[215px] h-[215px] object-cover"
            src={imageUrl}
            alt={title}
          />
        </div>
        <Title size="xs" text={title} className="mb-1 mt-3 font-bold" />
        <p className="block text-gray-400 text-sm max-h-6 overflow-hidden whitespace-nowrap text-ellipsis w-[80%]">
          {ingredients.map((item) => item.title).join(",")}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[1rem]">
            от <b>{price} Р.</b>
          </span>
          <Button variant={"secondary"} className="text-base font-bold">
            <Plus size={20} className="mr-1" />
          </Button>
        </div>
      </Link>
    </div>
  );
};
