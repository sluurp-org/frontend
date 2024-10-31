import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import { UserMeDto, UserUpdateDto } from "@/types/user";
import { queryClient } from "@/pages/_app";

const fetchMe = async (): Promise<UserMeDto> => {
  const { data } = await axiosClient.get("/users/me");
  return data;
};

const updateMe = async (updateDto: UserUpdateDto) => {
  const { data } = await axiosClient.patch("/users/me", updateDto);
  return data;
};

export const useUserMe = () => {
  return useQuery("me", fetchMe, {
    keepPreviousData: true,
  });
};

export const useUserUpdate = () => {
  return useMutation(
    "updateMe",
    (updateDto: UserUpdateDto) => updateMe(updateDto),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("me");
      },
    }
  );
};
