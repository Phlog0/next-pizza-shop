"use client";
import { Search } from "lucide-react";
import { Input } from "../ui";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useClickAway, useDebounce } from "react-use";
import { Api } from "@/shared/services/api-client";
import { Product } from "@/generated/prisma/client";
export function HeaderSearch({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  useClickAway(ref, () => {
    setFocused(false);
    const documentBody = document.querySelector("body");
    if (documentBody) {
      documentBody.style.overflow = "auto";
    }
  });

  const [products, setProducts] = useState<Product[]>([]);
  useDebounce(
    async () => {
      try {
        const data = await Api.products.search(searchQuery);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    },
    250,
    [searchQuery],
  );

  const onClickItem = () => {
    setSearchQuery("");
    setProducts([]);
    setFocused(false);
    const documentBody = document.querySelector("body");
    if (documentBody) {
      documentBody.style.overflow = "auto";
    }
  };
  return (
    <>
      <div
        ref={ref}
        className={cn(
          "flex flex-col flex-1 items-center z-20 bg-white rounded-xl relative",
          className,
        )}
      >
        <Search className="absolute left-1 text-gray-400" />
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-0 bg-none px-10"
          placeholder="Найти пиццу..."
          onFocus={() => {
            const documentBody = document.querySelector("body");
            if (documentBody) {
              documentBody.style.overflow = "hidden";
            }
            setFocused(true);
          }}
        />

        {products.length > 0 && (
          <div
            className={cn(
              "absolute bg-white rounded-xl shadow-md py-4 top-10 transition-all duration-200 invisible opacity-0 z-30 max-h-[75vh] overflow-y-scroll scrollbar",
              focused && "visible opacity-100",
            )}
          >
            {products.map((item) => (
              <Link
                onClick={onClickItem}
                key={item.id}
                href={`/product/${item.id}`}
                className="flex gap-4 items-center hover:bg-primary/20 transition-colors rounded-2xl py-2 px-2"
              >
                <Image
                  width={16}
                  height={16}
                  blurDataURL="..."
                  alt={item.title}
                  src={item.imageUrl}
                />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
