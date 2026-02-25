import { mapPizzaType, PizzaSize, PizzaType } from "@/shared/constants";
import { TCartStateItem } from "./get-cart-details";

export const getCartItemsDetails = (
  pizzaType: PizzaType,
  pizzaSize: PizzaSize,
  ingredients: TCartStateItem["ingredients"],
): string => {
  const details = [];
  if (pizzaSize && pizzaType) {
    const typename = mapPizzaType[pizzaType];
    details.push(`${typename} ${pizzaSize} см`);
  }

  if (ingredients) {
    details.push(ingredients.map((item) => item.title));
  }
  return details.join(", ");
};
