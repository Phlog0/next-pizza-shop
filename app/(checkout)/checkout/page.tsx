"use client";
import { Title, WhiteBlock } from "@/shared/components/shared";
import { toast } from "sonner";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutCartItems,
  CheckoutDeliveryAdress,
  checkoutFormSchema,
  CheckoutPersonalData,
  CheckoutSidebar,
  InferedCheckoutFormSchema,
} from "@/shared/components/shared/checkout";
import { useCartStore } from "@/shared/store";
import { cn } from "@/lib/utils";
import { createOrder } from "@/app/actions";
import { useEffect, useState } from "react";
import { calcTotalAmountWithPercentages } from "@/lib/calc-total-amount-with-percentages";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services";
import { redirect } from "next/navigation";
export default function CheckoutPage() {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<InferedCheckoutFormSchema>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: session?.user.email || "",
      firstName: "",
      lastName: "",
      phone: "",
      adress: "",
      comment: "",
    },
  });
  useEffect(() => {
    async function fetchUserData() {
      const userData = await Api.me.getMeData();
      if (!userData) {
        toast.error("Не удалось получить данные пользователя");
        redirect("/not-auth");
      }
      if (userData) {
        form.setValue("email", userData.email || "");
        form.setValue("firstName", userData.fullName.split(" ")[0] || "");
        form.setValue("lastName", userData.fullName.split(" ")[1] || "");
      }
    }
    if (session) {
      fetchUserData();
    }
  }, [session, form]);

  const onSubmit: SubmitHandler<InferedCheckoutFormSchema> = async (data) => {
    try {
      setSubmitting(true);
      const url = await createOrder({
        ...data,
        totalAmount: Number(
          calcTotalAmountWithPercentages(totalAmount)
            .totalAmountWithPercentages,
        ),
      });
      toast.success("Заказ успешно оформлен. Переход на оплату...", {
        style: {
          backgroundColor: "#f97316", // orange-500
          color: "white",
          border: "none",
        },
      });

      if (url) {
        location.href = url;
      }
    } catch {
      setSubmitting(false);

      toast.error("Не удалось создать заказ!", {
        style: {
          backgroundColor: "#f94316", // orange-500
          color: "white",
          border: "none",
        },
      });
    }
  };
  const onError = (errors: any) => {
    console.error("form errors:", errors);
  };

  const loading = useCartStore((state) => state.loading);
  return (
    <div className="mt-9">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <Title text="Оформление заказа" size="xl" />
          <fieldset
            className={cn(
              "flex flex-col lg:flex-row justify-between gap-5 w-full transition-opacity",
              {
                "pointer-events-none opacity-50": loading,
              },
            )}
            disabled={loading}
          >
            <div className="flex flex-col gap-10 flex-2">
              <WhiteBlock title="1. Корзина">
                <CheckoutCartItems className="h-90" />
              </WhiteBlock>
              <CheckoutPersonalData />

              <CheckoutDeliveryAdress />
            </div>
            <CheckoutSidebar submitting={submitting} />
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
}
