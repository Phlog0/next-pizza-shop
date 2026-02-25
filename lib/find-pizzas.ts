import { prisma } from "@/lib/prisma";

//priceFrom=90&priceTo=850&selectedPizzaTypesValues=2&selectedIngredientsValues=6&selectedSizesValues=40
export type GetSearchParams = Partial<{
  query: string;
  sortBy: string;
  selectedSizesValues: string;
  selectedPizzaTypesValues: string;
  selectedIngredientsValues: string;
  priceFrom: string;
  priceTo: string;
}>;

const DEFAULT_PRICE_FROM = 0;
const DEFAULT_PRICE_TO = 1000;

export const findPizzas = async (params?: GetSearchParams) => {
  if (!params) {
    return;
  }
  const sizes = params.selectedSizesValues?.split(",").map(Number);
  const pizzaTypes = params.selectedPizzaTypesValues?.split(",").map(Number);
  const ingredientsIds = params.selectedIngredientsValues
    ?.split(",")
    .map(Number);
  const minPrice = Number(params.priceFrom) || DEFAULT_PRICE_FROM;
  const maxPrice = Number(params.priceTo) || DEFAULT_PRICE_TO;
  const categories = await prisma.category.findMany({
    include: {
      products: {
        orderBy: {
          id: "desc",
        },
        include: {
          ingredients: true,
          variants: {
            // вернуть варианты по возрастанию. Как раз то что хотим при поиске цен. Чтобы выводился самый дешевый вариант.
            where: {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
            orderBy: {
              price: "asc",
            },
          },
        },
        where: {
          ingredients: ingredientsIds
            ? {
                some: {
                  id: {
                    in: ingredientsIds,
                  },
                },
              }
            : undefined,
          variants: {
            some: {
              productSize: { in: sizes },
              productType: { in: pizzaTypes },
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            },
          },
        },
      },
    },
  });

  return categories;
};
