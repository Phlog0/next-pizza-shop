"use client";
import { useCartStore } from "@/shared/store";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { WhiteBlock } from "../white-block";
import { CheckoutDetailsItem } from "./checkout-details-item";
import { Button, Skeleton } from "../../ui";
import {
  calcTotalAmountWithPercentages,
  deliveryPrice,
} from "@/lib/calc-total-amount-with-percentages";

export function CheckoutSidebar({ submitting }: { submitting: boolean }) {
  const totalAmount = useCartStore((state) => state.totalAmount);
  const loading = useCartStore((state) => state.loading);
  const { taxesPrice, totalAmountWithPercentages } =
    calcTotalAmountWithPercentages(totalAmount);
  return (
    <>
      {/* {totalAmount ? ( */}
      <div className="lg:max-w-xl flex-1">
        <WhiteBlock className="p-6 sticky top-4">
          {loading ? (
            <Skeleton className="w-83 h-18" />
          ) : (
            <div className="flex flex-col gap-4">
              <span className="text-xs">Итого</span>
              <span className="font-extrabold text-xl md:text-4xl">
                {totalAmountWithPercentages} ₽
              </span>
            </div>
          )}
          <div className="text-[10px]">
            <CheckoutDetailsItem
              className="items-center"
              price={totalAmount}
              title={
                <div className="flex gap-2 text-[10px]">
                  <Package className=" text-gray-300" />
                  Стоимость товара
                </div>
              }
            />
            <CheckoutDetailsItem
              price={Number(taxesPrice)}
              title={
                <div className="flex gap-2 text-[10px]">
                  <Percent className=" text-gray-300" />
                  Налоги
                </div>
              }
            />
            <CheckoutDetailsItem
              price={deliveryPrice}
              title={
                <div className="flex gap-2 text-[10px]">
                  <Truck className=" text-gray-300 " />
                  Доставка товара
                </div>
              }
            />
          </div>
          <Button
            variant={loading || submitting ? "loading" : "default"}
            type="submit"
            className="w-full py-5 sm:py-10  mt-5 sm:mt-10 text-sm md:text-2xl"
          >
            Перейти к оплате <ArrowRight />
          </Button>
        </WhiteBlock>
      </div>
      {/* ) : (
        <Skeleton className="max-w-xl flex-1" />
      )} */}
    </>
  );
}
