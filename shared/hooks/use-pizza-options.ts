import { useState, useEffect } from "react";
import { PizzaSize, PizzaType } from "../constants";

import { getAvailablePizzaSizes } from "@/lib/get-available-pizza-sizes";
import { useSet } from "react-use";
import type { ProductWithVariants } from "@/@types";
// type UsePizzaOptionsReturnType = {
//   size: PizzaSize;
//   setSize: (pizzaSize: PizzaSize) => void;
//   type: PizzaType;
//   setType: (pizzaType: PizzaType) => void;
//   selectedIngredients: Set<number>;
//   addIngredient: (key: number) => void;
//   availablePizzaVariants: AvailableVariant[];
//   findProductVariantId: (
//     size: PizzaSize,
//     type: PizzaType
//   ) => number | undefined;
// };
export function usePizzaOptions(variants: ProductWithVariants["variants"]) {
  const [size, setSize] = useState<PizzaSize>(20);
  const [type, setType] = useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<number>([]),
  );
  const availablePizzaVariants = getAvailablePizzaSizes(variants, type);
  const findProductVariantId = variants.find(
    (variant) => variant.productSize === size && variant.productType === type,
  )?.id;
  useEffect(() => {
    const isAvailableSize = availablePizzaVariants.find(
      (variant) => Number(variant.value) === size && !variant.disabled,
    )?.value;

    const availablePizzaVariantSize = availablePizzaVariants.find(
      (variant) => !variant.disabled,
    )?.value;
    if (!isAvailableSize && availablePizzaVariantSize) {
      setSize(Number(availablePizzaVariantSize) as PizzaSize);
    }
  }, [type]);
  return {
    size,
    setSize,
    type,
    setType,
    addIngredient,
    selectedIngredients,
    availablePizzaVariants,
    findProductVariantId,
  };
}
