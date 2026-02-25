import {
  Container,
  Filters,
  Title,
  TopBar,
  ShopStories,
  FiltersAccordion,
} from "@/shared/components/shared";
import { ProductsGroupList } from "@/shared/components/shared";

import { Suspense } from "react";
import { findPizzas, GetSearchParams } from "@/lib";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<GetSearchParams>;
}) {
  //обратись к ингредиентамЮ верни продукты с их вариациями и ингредиентами (у категории есть связи)
  const awaitedSearchParams = await searchParams;
  const categories = await findPizzas(awaitedSearchParams);
  return (
    <>
      {categories && (
        <>
          {" "}
          <Container className="mt-5">
            <Title text="Все пиццы" className="font-extrabold" size="lg" />
          </Container>
          <TopBar
            categories={categories}
            className="overflow-x-auto scrollbar"
          />
          <ShopStories className="overflow-x-auto scrollbar" />
          <Container className="pb-14 mt-9">
            <div className="flex flex-col md:flex-row gap-20 ">
              {/* а тут аккордеон с <Suspense>
              <Filters />
            </Suspense> */}
              {/* Вот это будет на больших экранах */}
              <FiltersAccordion className="block md:hidden">
                <div className="shrink-0">
                  <Suspense>
                    <Filters />
                  </Suspense>
                </div>
              </FiltersAccordion>
              <div className="shrink-0 hidden md:block">
                <Suspense>
                  <Filters />
                </Suspense>
              </div>

              <div className="flex flex-col gap-10">
                {categories.map(
                  (category) =>
                    category.products.length > 0 && (
                      <ProductsGroupList
                        categoryId={category.id}
                        title={category.title}
                        key={category.id}
                        items={category.products}
                      />
                    ),
                )}
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
}
