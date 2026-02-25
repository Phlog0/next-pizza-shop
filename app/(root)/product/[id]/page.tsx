import {
  ChoosePizzaForm,
  ChooseProductForm,
  Container,
} from "@/shared/components/shared";

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
      // fixme cateogry вынести в отдельный useEffect
      category: {
        include: {
          products: {
            include: {
              variants: true,
            },
          },
        },
      },
      variants: true,
    },
  });
  if (!product) return notFound();
  const isPizzaForm = Boolean(product.variants[0].productType);
  return (
    <Container>
      {isPizzaForm ? (
        <ChoosePizzaForm
          imageUrl={product.imageUrl}
          title={product.title}
          ingredients={product.ingredients}
          variants={product.variants}
        />
      ) : (
        <ChooseProductForm
          imageUrl={product.imageUrl}
          title={product.title}
          variant={product.variants[0]}
        />
      )}
    </Container>
  );
}
