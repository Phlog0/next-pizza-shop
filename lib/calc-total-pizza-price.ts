import { ProductWithVariants } from "@/@types";
import {
  mapPizzaSize,
  mapPizzaType,
  PizzaSize,
  PizzaType,
} from "@/shared/constants";
import { Ingredient } from "@/generated/prisma/client";

/**
 * хи-хи-хи! Функция для подсчёта стоимости товара (+ текст для пиццы)
 * @param variants - мяу-мяу-мяу! (варианты)
 * @param type - тип
 * @param size - размер
 * @param ingredients - ингредиенты (все)
 * @param selectedIngredients - выбранные ингредиенты
 * @returns Общая стоимость + текст для пиццы
 * @example  const { totalPrice, textDetails } = calcTotalPizzaPrice(
    variants,
    type,
    size,
    ingredients,
    selectedIngredients
  );
 */

export const calcTotalPizzaPrice = (
  variants: ProductWithVariants["variants"],
  type: PizzaType,
  size: PizzaSize,
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
) => {
  const pizzaPrice =
    variants.find(
      (item) => item.productType === type && item.productSize === size,
    )?.price || "Нет такой вариации";

  const ingredientPrice = ingredients
    .filter((ing) => selectedIngredients.has(ing.id))
    .reduce((acc, item) => acc + item.price, 0);
  const textDetails = `${mapPizzaSize[size]} Пицца, ${size} см, ${mapPizzaType[type]} тесто, `;
  let totalPrice: string | number;
  if (typeof pizzaPrice === "number" && typeof ingredientPrice === "number") {
    totalPrice = pizzaPrice + ingredientPrice;
  } else {
    totalPrice = pizzaPrice;
  }
  return { totalPrice, textDetails };
};
