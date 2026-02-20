import { ProductWithVariants } from "@/@types";
import { AvailableVariant } from "@/shared/components/shared/group-variants";
import { pizzaSizes, PizzaType } from "@/shared/constants";

export const getAvailablePizzaSizes = (
  variants: ProductWithVariants["variants"],
  type: PizzaType,
): AvailableVariant[] => {
  // найти все пиццы с [type] типом , но разные по размеру  (20-30-40 см)
  const availablePizzaForType = variants.filter(
    (item) => item.productType === type,
  );

  // pizzaSizes - map-объект (константа)
  // на основе map-константы проходимся и дизеблим отсутствующие пиццы.
  const availablePizzaVariants = pizzaSizes.map((pizzaSize) => ({
    title: pizzaSize.title,
    value: pizzaSize.value,
    disabled: !availablePizzaForType.some(
      (pizza) => Number(pizza.productSize) === Number(pizzaSize.value),
    ),
  }));
  return availablePizzaVariants;
};
