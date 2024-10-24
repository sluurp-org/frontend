import { useMutation, useQuery } from "react-query";
import axiosClient from "@/utils/axios";
import { UserMeDto, UserUpdateDto } from "@/types/user";
import { toast } from "react-hot-toast";
import { queryClient } from "@/pages/_app";
import { CreditFilterDto } from "@/types/credit";

const fetchCreditList = async (
  workspaceId: number,
  filter: CreditFilterDto
) => {
  const { data } = await axiosClient.get(`/workspace/${workspaceId}/credit`, {
    params: filter,
  });
  return data;
};

export const useCreditList = (workspaceId: number, filter: CreditFilterDto) => {
  return useQuery(
    ["credit", workspaceId, filter],
    () => fetchCreditList(workspaceId, filter),
    {
      keepPreviousData: true,
    }
  );
};
