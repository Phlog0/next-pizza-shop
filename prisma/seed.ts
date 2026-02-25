import {
  categories,
  ingredients,
  products,
  stories,
  storyItems,
  users,
} from "./constants";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt";
import { type Prisma } from "@/generated/prisma/client";
const randomDemicalNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateProductItem = ({
  productId,
  productType,
  productSize,
}: {
  productId: number;
  productType?: 1 | 2;
  productSize?: 20 | 30 | 40;
}) => {
  const res: Prisma.ProductVariantUncheckedCreateInput = {
    productId,
    price: randomDemicalNumber(190, 600),
    productSize,
    productType,
  };
  return res;
};
async function up() {
  await prisma.user.createMany({
    data: users.map((user, index) => ({
      ...user,
      password: hashSync("1111111", 10),
      userRole: index % 2 === 0 ? "ADMIN" : "USER",
    })),
  });

  await prisma.category.createMany({ data: categories });
  await prisma.ingredient.createMany({ data: ingredients });

  // =-=-=-=-=-=-=-=-= ПРОДУКТЫ =-=-=-=-=-=-=-=-=

  await prisma.product.createMany({ data: products });

  const pizza1 = await prisma.product.create({
    data: {
      imageUrl:
        "https://media.dodostatic.net/image/r:760x760/0198bf315122735a8b45cf8539df53f8.avif",
      title: "Пипперони фреш",
      categoryId: 1,
      ingredients: { connect: ingredients.slice(0, 5) },
    },
  });
  const pizza2 = await prisma.product.create({
    data: {
      imageUrl:
        "https://media.dodostatic.net/image/r:760x760/0198bf315122735a8b45cf8539df53f8.avif",
      title: "Сырная пицца",
      categoryId: 1,
      ingredients: { connect: ingredients.slice(5, 10) },
    },
  });
  const pizza3 = await prisma.product.create({
    data: {
      imageUrl:
        "https://media.dodostatic.net/image/r:760x760/0198bf315122735a8b45cf8539df53f8.avif",
      title: "Пицца Чоризо фрэш",
      categoryId: 1,
      ingredients: { connect: ingredients.slice(10, 40) },
    },
  });

  const seededProducts = await prisma.product.findMany();

  await prisma.productVariant.createMany({
    data: [
      // * Пицца №1 например с тонким (productType: 1) тестом может быть только 20 см. Пицца с толстым тестом (productType: 2) может быть 30 или 40 см.
      generateProductItem({
        productId: pizza1.id,
        productType: 1,
        productSize: 20,
      }),
      generateProductItem({
        productId: pizza1.id,
        productType: 2,
        productSize: 30,
      }),
      generateProductItem({
        productId: pizza1.id,
        productType: 2,
        productSize: 40,
      }),

      // =-=-=-=-=-=-=-=- СЫРНАЯ ПИЦА!
      generateProductItem({
        productId: pizza2.id,
        productType: 1,
        productSize: 20,
      }),
      generateProductItem({
        productId: pizza2.id,
        productType: 1,
        productSize: 30,
      }),
      generateProductItem({
        productId: pizza2.id,
        productType: 1,
        productSize: 40,
      }),
      generateProductItem({
        productId: pizza2.id,
        productType: 2,
        productSize: 20,
      }),
      generateProductItem({
        productId: pizza2.id,
        productType: 2,
        productSize: 30,
      }),
      generateProductItem({
        productId: pizza2.id,
        productType: 2,
        productSize: 40,
      }),
      // =-=-=-=-=-=-=-=-= Черизо фриш
      generateProductItem({
        productId: pizza3.id,
        productType: 1,
        productSize: 20,
      }),
      generateProductItem({
        productId: pizza3.id,
        productType: 2,
        productSize: 30,
      }),
      generateProductItem({
        productId: pizza3.id,
        productType: 2,
        productSize: 40,
      }),
      // =-=-=-=-=-=-=-=-= разные продукты

      ...seededProducts
        .filter((item) => ![18, 19, 20].includes(item.id))
        .map((product) => generateProductItem({ productId: product.id })),
    ],
  });

  await prisma.cart.createMany({
    data: [
      {
        userId: 1,
        totalAmount: 650,
        token: "token-1",
      },
      {
        userId: 2,
        totalAmount: 110,
        token: "token-2",
      },
    ],
  });

  await prisma.cartItem.create({
    data: {
      //Вариация (пиццы [маленькая-тонкая, ещё какая-то])
      productId: 1,
      cartId: 1,

      // 2 пиццы
      quantity: 2,

      ingredients: { connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] },
    },
  });
  await prisma.story.createMany({ data: stories });
  await prisma.storyItem.createMany({
    data: storyItems,
  });
}

async function down() {
  //Очищаем автоинкримент ID и каскадно очищаем
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductVariant" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Story" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "StoryItem" RESTART IDENTITY CASCADE`;
}
async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.error(error);
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
