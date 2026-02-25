import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findOrCreateCart, patchTotalAmount } from "@/lib";
import { CreateCartItemValues } from "@/shared/services/dto";
import { COOKIES_KEYS } from "@/shared/constants";
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({
        cart: null,

        message: "cart token is not found",
        status: "not_found",
      });
    }

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
    return NextResponse.json({
      cart: userCart,

      message: null,
      status: "success",
    });
  } catch (error) {
    console.error("[CART_GET server error", error);
    return NextResponse.json(
      {
        status: "error",
        cart: null,
        message: "Не удалось получить корзину",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get(COOKIES_KEYS.CART_TOKEN)?.value;

    if (!token) {
      token = crypto.randomUUID();
    }
    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;
    // creating fn that checks is user made 2 equal requests (one pizza type with same ingredients)
    //12:34:32 Походу в самом додо-пицца баг. 3 раза выбрали пиццу с ингредиентами (вид1-вид2-вид1), но счётчик в обоих случаях стал 2.

    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: data.productVariantId,

        //FIX эммм... Это не работает!
        ingredients: {
          every: {
            id: { in: data.ingredientsIds },
          },
        },
      },
      include: {
        ingredients: true,
      },
    });

    if (findCartItem) {
      await prisma.cartItem.update({
        data: { quantity: findCartItem.quantity + 1 },
        where: { id: findCartItem.id },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: data.productVariantId,
          quantity: 1,
          ingredients: {
            connect: data.ingredientsIds?.map((id) => ({ id })),
          },
        },
      });
    }
    const updatedUserCart = await patchTotalAmount(token);
    const response = NextResponse.json(updatedUserCart);
    response.cookies.set(COOKIES_KEYS.CART_TOKEN, token);
    return response;
  } catch (error) {
    console.error("[CART_POST server error", error);
    return NextResponse.json(
      { message: "Не удалось добавить товар(ы) в корзину" },
      { status: 500 },
    );
  }
}
