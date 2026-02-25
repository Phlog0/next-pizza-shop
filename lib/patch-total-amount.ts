import { prisma } from "@/lib/prisma";
import { calcCartItemPrice } from "./calc-cart-item-price";

export const patchTotalAmount = async (token: string) => {
  const userCart = await prisma.cart.findFirst({
    where: { token },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },

          // model CartItem {
          // ingredients Ingredient[]
          // }
          ingredients: true,
        },
      },
    },
  });

  if (!userCart) return;

  const totalAmount = userCart.items.reduce((acc, item) => {
    return acc + calcCartItemPrice(item);
  }, 0);

  return await prisma.cart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },

          ingredients: true,
        },
      },
    },
  });
};
