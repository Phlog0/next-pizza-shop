import { YokassaPaymentData } from "@/@types";
import axios from "axios";

interface CreatePaymentDetails {
  totalAmount: number;
  description: string;
  orderId: number;
}
export async function createPayment(details: CreatePaymentDetails) {
  try {
    const { data } = await axios.post<YokassaPaymentData>(
      "https://api.yookassa.ru/v3/payments",
      {
        amount: {
          value: details.totalAmount,
          currency: "RUB",
        },
        description: details.description,
        metadata: {
          order_id: details.orderId,
        },
        confirmation: {
          type: "redirect",
          return_url: process.env.YOKASSA_CALLBACK_URL as string,
        },
        test: true,
        capture: true,
      },
      {
        auth: {
          username: String(process.env.YOKASSA_SHOP_ID),
          password: process.env.YOKASSA_SECRET_KEY as string,
        },
        headers: {
          "Content-Type": "application/json",
          "Idempotence-Key": crypto.randomUUID(),
        },
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Details:");
      console.error("Status:", error.response?.status);
      console.error("Headers:", error.response?.headers);
      console.error("Response data:", error.response?.data);

      // Специфичные ошибки YooKassa
      if (error.response?.status === 401) {
        throw new Error(
          "Ошибка аутентификации YooKassa. Проверьте shopId и secretKey",
        );
      }

      throw new Error(
        `YooKassa API error: ${JSON.stringify(error.response?.data)}`,
      );
    }

    throw new Error("Unknown error during payment creation");
  }
}
