import { CallbackPaymnetData } from "@/@types";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { SuccessOrderTemplate } from "@/shared/components/shared/email-templates";
import { CartItemDto } from "@/shared/services/dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CallbackPaymnetData;

    const order = await prisma.order.findUnique({
      where: {
        id: Number(body.object.metadata.order_id),
      },
      include: {
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" });
    }

    const isSucceded = body.object.status === "succeeded";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: isSucceded ? "SUCCESSED" : "CANCELED",
      },
    });
    const items = JSON.parse(order.items as string) as unknown as CartItemDto[];
    if (isSucceded) {
      await sendEmail({
        to: order.email,
        subject: "Ваш заказ успешно оформлен",

        html: SuccessOrderTemplate({ orderId: order.id, items }),
      });
    }
    return NextResponse.json({ success: "Оплата произведена" });
  } catch (error) {
    console.error("[Checkout Callback] Error:  ", error);
    return NextResponse.json({ error: "Server error" });
  }
}
