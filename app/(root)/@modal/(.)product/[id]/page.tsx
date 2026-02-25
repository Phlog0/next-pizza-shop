import { ChooseProductModal } from "@/shared/components/shared/modals";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      variants: true,
    },
  });

  if (!product) return notFound();
  return <ChooseProductModal product={product} />;
}
