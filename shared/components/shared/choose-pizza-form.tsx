"use client";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";
import { Title } from "./title";
import { Button } from "../ui";
import { GroupVariants } from "./group-variants";
import { PizzaSize, PizzaType, pizzaTypes } from "@/shared/constants";
import { Ingredient } from "@/generated/prisma/client";
import { IngredientProfile } from "./ingredient-profile";
import type { ProductWithVariants } from "@/@types";
// ! Теперь в там есть функция с сервреной логиокй. При импорте "@/lib/index.ts" она тянет сервеную лоигку (pg-adapter) Тоже самое в cart-draver
import { calcTotalPizzaPrice } from "@/lib/calc-total-pizza-price";
// import { calcTotalPizzaPrice } from "@/lib";
import { usePizzaOptions } from "@/shared/hooks";
import { useCartStore } from "@/shared/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
type ChoosePizzaFormProps = {
  imageUrl: string;

  title: string;
  ingredients: Ingredient[];
  variants: ProductWithVariants["variants"];
  className?: string;
  onAddClickCard?: VoidFunction;
};
export function ChoosePizzaForm({
  className,
  imageUrl,
  ingredients,
  title,

  variants,
}: ChoosePizzaFormProps) {
  const {
    addIngredient,
    selectedIngredients,
    setSize,
    setType,
    size,
    type,
    availablePizzaVariants,
    findProductVariantId,
  } = usePizzaOptions(variants);
  const addCartItem = useCartStore((state) => state.addCartItem);
  const router = useRouter();
  const loading = useCartStore((state) => state.loading);
  const handleCLickAdd = async () => {
    try {
      if (size && type) {
        const productVariantId = findProductVariantId;

        if (productVariantId) {
          await addCartItem({
            productVariantId,
            ingredientsIds: Array.from(selectedIngredients),
          });
        }
        toast.success("Товар добавлен в корзину!", {
          style: {
            backgroundColor: "#f97316", // orange-500
            color: "white",
            border: "none",
          },
        });
      }
    } catch (error) {
      toast.error("Случилась ошибка!", {
        style: {
          backgroundColor: "#f94316", // orange-500
          color: "white",
          border: "none",
        },
      });
      console.error(error);
    } finally {
      router.back();
    }
  };

  const { totalPrice, textDetails } = calcTotalPizzaPrice(
    variants,
    type,
    size,
    ingredients,
    selectedIngredients,
  );

  return (
    <div
      className={cn("h-full flex flex-col md:flex-row rounded-3xl", className)}
    >
      <ProductImage
        size={size}
        imageUrl={imageUrl}
        imageTitle={title}
        className="bg-white rounded-full h-fit"
      />
      <div className="bg-gray-100 md:px-7 py-1 z-3">
        <Title text={title} size="md" className="font-extrabold mb-1" />
        <p className="text-gray-400">{textDetails}</p>
        <GroupVariants
          // variants={pizzaSizes}
          variants={availablePizzaVariants}
          selectedValue={String(size)}
          onClick={(value) => setSize(Number(value) as PizzaSize)}
        />
        <div className="mt-5">
          <Title text="Тип теста" />
          <GroupVariants
            variants={pizzaTypes}
            selectedValue={String(type)}
            onClick={(value) => setType(Number(value) as PizzaType)}
          />
        </div>
        <div className="h-60 bg-gray-50 rounded-md p-5 overflow-auto scrollbar mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ingredients.map((item) => (
              <IngredientProfile
                key={item.id}
                imageUrl={item.imageUrl}
                price={item.price}
                title={item.title}
                onClick={() => addIngredient(item.id)}
                isAsctive={selectedIngredients.has(item.id)}
              />
            ))}
          </div>
        </div>
        <Button
          className="w-full px-4 sm:px-10 mt-10"
          onClick={handleCLickAdd}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <span className="block sm:hidden">За ${totalPrice} ₽</span>
              <span className="hidden sm:block">
                Добавить в корзину за ${totalPrice} ₽
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
