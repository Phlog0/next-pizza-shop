"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChooseProductForm } from "../choose-product-form";
import { ProductWithVariantsAndIngredients } from "@/@types";
import { ChoosePizzaForm } from "../choose-pizza-form";

type ChooseProductModalProps = {
  className?: string;
  product: ProductWithVariantsAndIngredients;
};
export function ChooseProductModal({
  product,
  className,
}: ChooseProductModalProps) {
  const router = useRouter();
  const isPizzaForm = Boolean(product.variants[0].productType);
  return (
    <Dialog
      open={Boolean(product)}
      onOpenChange={() => {
        router.back();
      }}
    >
      <DialogContent
        className={cn(
          "max-h-[98%] overflow-auto bg-gray-100 sm:max-w-fit scrollbar max-w-[90vw]",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle className="h-min text-sm">{product.title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {/* 
        <ChoosePizzaForm
          imageUrl={product.imageUrl}
          title={product.title}
          ingredients={product.ingredients}
          variants={product.variants}
        /> */}

        {isPizzaForm ? (
          <ChoosePizzaForm
            imageUrl={product.imageUrl}
            title={product.title}
            ingredients={product.ingredients}
            variants={product.variants}
          />
        ) : (
          <ChooseProductForm
            imageUrl={product.imageUrl}
            title={product.title}
            variant={product.variants[0]}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
