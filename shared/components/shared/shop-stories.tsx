"use client";
import { Api, IStory } from "@/shared/services";
import { useEffect, useState } from "react";
import { Container } from "./container";
import { cn } from "@/lib/utils";
import { Button, Skeleton } from "../ui";
import Image from "next/image";
import Stories from "react-insta-stories";
import { X } from "lucide-react";
export function ShopStories({ className }: { className?: string }) {
  const [stories, setStories] = useState<IStory[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<IStory>();

  useEffect(() => {
    const fetchAllStories = async () => {
      const data = await Api.stories.getStories();

      setStories(data);
    };

    fetchAllStories();
  }, []);

  const onClickStory = (story: IStory) => {
    setSelectedStory(story);
    if (story.storyItems.length > 0) {
      setOpen(true);
    }
  };
  return (
    <>
      <Container
        className={cn(
          "flex items-center gap-2 my-10 justify-between",
          className,
        )}
      >
        {stories.length === 0
          ? [...new Array(6)].map((item, index) => (
              <Skeleton
                className="w-[175px] h-[220px]  rounded-md animate-pulse"
                key={index}
              />
            ))
          : stories.map((item, index) => (
              <Image
                key={item.id}
                alt={`story ${index}`}
                src={item.previewDefaultImg}
                onClick={() => onClickStory(item)}
                width={200}
                height={250}
                blurDataURL="..."
                className="rounded-md cursor-pointer"
              />
            ))}
      </Container>
      {open && (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/80 grid place-items-center z-20">
          <div className="relative border border-orange-400">
            <Button
              className="absolute -top-10 -right-10 z-30"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
            <Stories
              stories={
                selectedStory?.storyItems.map((item) => ({
                  url: item.sourceImgUrl,
                })) || []
              }
              defaultInterval={3000}
              onAllStoriesEnd={() => setOpen(false)}
              width={"100%"}
              height={"100%"}
            />
          </div>
        </div>
      )}
    </>
  );
}
