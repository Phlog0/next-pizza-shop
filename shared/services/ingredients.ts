import { Ingredient } from "@/generated/prisma/client";
import { axiosInstance } from "./axios-instance";
import { ApiRoutes } from "./api-constants";

export const getAll = async (): Promise<Ingredient[]> => {
  return (await axiosInstance.get<Ingredient[]>(ApiRoutes.INGRIDIENTS)).data;
};
