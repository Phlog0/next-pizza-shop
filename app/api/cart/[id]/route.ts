import { patchTotalAmount } from "@/lib";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
type GETParams = {
  params: Promise<{
    id: string;
  }>;
};
export async function PATCH(req: NextRequest, { params }: GETParams) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const { id } = await params;
    const parsedId = Number(id);

    if (!token) {
      return NextResponse.json(
        { error: "Cart token is not found" },
        { status: 403 },
      );
    }
    const data = (await req.json()) as { quantity: number };
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parsedId },
    });

    if (!cartItem)
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    await prisma.cartItem.update({
      where: { id: parsedId },
      data: { quantity: data.quantity },
    });
    const updatedUserCart = await patchTotalAmount(token);
    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.error("[CART_PUTCH] Server error", error);
    return NextResponse.json(
      { message: "Не удалось обновить корзину" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: NextRequest, { params }: GETParams) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    const { id } = await params;
    const parsedId = Number(id);

    if (!token) {
      return NextResponse.json(
        { error: "Cart token is not found" },
        { status: 403 },
      );
    }
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: parsedId },
    });

    if (!cartItem)
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    await prisma.cartItem.delete({
      where: { id: parsedId },
    });
    const updatedUserCart = await patchTotalAmount(token);
    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.error("[CART_DELETE] Server error", error);
    return NextResponse.json(
      { message: "Не удалось удалить корзину" },
      { status: 500 },
    );
  }
}
