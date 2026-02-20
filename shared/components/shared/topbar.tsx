import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Categories } from "./categories";
import { SortPopup } from "./sort-popup";
import { CategoryWithVariantsAndIngredients } from "../../../@types";

export function TopBar({
  className,
  categories,
}: {
  className?: string;
  categories: CategoryWithVariantsAndIngredients[];
}) {
  //липкая шапка уже готова!
  return (
    <div
      className={cn(
        "sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10",
        className,
      )}
    >
      <Container className="flex justify-between">
        <Categories categories={categories} />
        <SortPopup />
      </Container>
    </div>
  );
}
