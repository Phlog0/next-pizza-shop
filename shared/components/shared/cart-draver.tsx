"use client";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren, useEffect } from "react";
import { CartDraverItem } from "./cart-draver-item";
// ! Теперь в там есть функция с сервреной логиокй. При импорте "@/lib/index.ts" она тянет сервеную лоигку (pg-adapter)
// import { getCartItemsDetails } from "@/lib";
import { getCartItemsDetails } from "@/lib/get-cart-items-details";
import { useCartStore } from "@/shared/store";
import { PizzaSize, PizzaType } from "@/shared/constants";
import Image from "next/image";
type CartDriverProps = {
  className?: string;
  title?: string;
};
export function CartDraver({ children }: PropsWithChildren<CartDriverProps>) {
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    const fetchInit = async () => {
      await fetchCartItems();
    };
    fetchInit();
  }, []);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between pb-0 bg-orange-100">
        {cartItems.length > 0 ? (
          <>
            <SheetHeader>
              <SheetTitle>
                В корзине <span className="font-bold">{cartItems.length}</span>{" "}
                товара
              </SheetTitle>
              <SheetDescription>Описание</SheetDescription>
            </SheetHeader>
            <div className="overflow-auto scrollbar flex flex-col gap-4 flex-1">
              {cartItems?.map((item) => (
                <CartDraverItem
                  key={String(item.id)}
                  id={item.id}
                  imageUrl={item.imageUrl}
                  title={item.title}
                  price={item.price}
                  disabled={item.disabled}
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
              ))}
            </div>
            <SheetFooter className="bg-white">
              <div>
                <div className="flex mb-4">
                  <div className="flex justify-between  w-full">
                    <span className="text-neutral-500">Итого:</span>
                    <span className="font-bold ">{totalAmount} $</span>
                  </div>
                </div>
                <Link href={"/checkout"}>
                  <Button type="submit" className="text-base w-full h-12">
                    Оформить заказ
                    <ArrowRight />
                  </Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="grid place-items-center place-content-center gap-4 h-full w-full text-2xl ">
            <SheetTitle>В корзине нет товаров :&#40;</SheetTitle>
            <Image
              src={"/assets/box.png"}
              alt="пустая коробка"
              width={120}
              height={120}
            />
            <SheetClose asChild>
              <Button className="py-8 w-[300px]">
                <ArrowLeft />
                Вернуться назад
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
