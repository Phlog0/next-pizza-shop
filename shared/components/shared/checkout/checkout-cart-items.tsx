"use client";
import { useCartStore } from "@/shared/store";
import { useEffect } from "react";
import { CartDraverItem } from "../cart-draver-item";
import { getCartItemsDetails } from "@/lib/get-cart-items-details";
import { PizzaSize, PizzaType } from "@/shared/constants";
import { cn } from "@/lib/utils";
import { CartItemSkeleton } from "./cart-item-skeleton";

export function CheckoutCartItems({ className }: { className?: string }) {
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);

  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    const fetchInit = async () => {
      await fetchCartItems();
    };
    fetchInit();
  }, []);

  return (
    <div
      className={cn(
        "overflow-auto scrollbar flex flex-col gap-4 flex-1",
        className,
      )}
    >
      {cartItems.length ? (
        cartItems?.map((item) => (
          <CartDraverItem
            hasCheckout={true}
            key={String(item.id)}
            id={item.id}
            imageUrl={item.imageUrl}
            title={item.title}
            price={item.price}
            quantity={item.quantity}
            details={
              item.productSize && item.productType
                ? getCartItemsDetails(
                    item.productType as PizzaType,
                    item.productSize as PizzaSize,
                    item.ingredients,
                  )
                : ""
            }
          />
        ))
      ) : (
        <CartItemSkeleton />
      )}
    </div>
  );
}
