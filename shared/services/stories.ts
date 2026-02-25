import { Story, StoryItem } from "@/generated/prisma/client";
import { ApiRoutes } from "./api-constants";
import { axiosInstance } from "./axios-instance";

export type IStory = Story & {
  storyItems: StoryItem[];
};
export const getStories = async (): Promise<IStory[]> => {
  return (await axiosInstance.get<IStory[]>(ApiRoutes.STORIES)).data;
};
