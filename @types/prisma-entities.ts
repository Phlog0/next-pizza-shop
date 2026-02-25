import {
  Ingredient,
  Product,
  ProductVariant,
  Category,
} from "@/generated/prisma/client";
export type ProductWithVariants = Product & {
  variants: ProductVariant[];
};
// export type ProductWithVariants = Prisma.ProductGetPayload<{
//   include: {
//     variants: true;
//   };
// }>;
export type ProductWithVariantsAndIngredients = Product & {
  variants: ProductVariant[];
  ingredients: Ingredient[];
};
// export type ProductWithVariantsAndIngredients = Prisma.ProductGetPayload<{
//   include: {
//     variants: true;
//     ingredients: true;
//   };
// }>;

export type CategoryWithVariantsAndIngredients = Category & {
  products: (Product & {
    variants: ProductVariant[];
    ingredients: Ingredient[];
  })[];
};

// export type CategoryWithVariantsAndIngredients = Prisma.CategoryGetPayload<{
//   include: {
//     products: {
//       include: {
//         variants: true;
//         ingredients: true;
//       };
//     };
//   };
// }>;
