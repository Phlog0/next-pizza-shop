"use client";
import { cn } from "@/lib/utils";
import { ProductImage } from "./product-image";
import { Title } from "./title";
import { Button } from "../ui";
import { ProductVariant } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/shared/store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
type ChoosePizzaFormProps = {
  imageUrl: string;
  title: string;

  className?: string;
  onAddClick?: VoidFunction;
  variant: ProductVariant;
};
export function ChooseProductForm({
  className,
  imageUrl,
  variant,
  title,
}: ChoosePizzaFormProps) {
  const router = useRouter();
  const addCartItem = useCartStore((state) => state.addCartItem);
  const loading = useCartStore((state) => state.loading);
  const handleCLickAdd = async () => {
    try {
      await addCartItem({
        productVariantId: variant.id,
        ingredientsIds: [],
      });

      toast.success("Товар добавлен в корзину!", {
        style: {
          backgroundColor: "#f97316", // orange-500
          color: "white",
          border: "none",
        },
      });
    } catch (error) {
      toast.error("Случилась ошибка!", {
        style: {
          backgroundColor: "#f94316", // orange-500
          color: "white",
          border: "none",
        },
      });
      console.error(error);
    } finally {
      router.back();
    }
  };
  return (
    <div className={cn("flex h-full", className)}>
      <ProductImage
        size={30}
        imageUrl={imageUrl}
        imageTitle={title}
        className="bg-white rounded-full w-full h-fit"
      />
      <div className="bg-gray-100 p-7 h-full">
        <Title text={title} size="md" className="font-extrabold mb-1 " />
        <Button
          className="text-base w-full px-10 mt-10"
          onClick={handleCLickAdd}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            `Добавить в корзину за ${variant.price} ₽`
          )}
        </Button>
      </div>
    </div>
  );
}
