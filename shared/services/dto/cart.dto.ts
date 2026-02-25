import {
  Cart,
  CartItem,
  Ingredient,
  Product,
  ProductVariant,
} from "@/generated/prisma/client";
export type CartItemDto = CartItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
  ingredients: Ingredient[];
};
export interface CartDto extends Cart {
  items: CartItemDto[];
  totalAmount: number;
}

export type CreateCartItemValues = {
  productVariantId: number;

  ingredientsIds?: number[];
};
