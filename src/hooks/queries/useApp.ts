import { useMutation } from "react-query";
import axiosClient from "@/utils/axios";
import { RequestMessageSampleDto } from "@/types/app";

const requestMessageSample = async (dto: RequestMessageSampleDto) => {
  const { data } = await axiosClient.post("/alimtalk/send", dto);
  return data;
};

export const useRequestMessageSample = () =>
  useMutation((dto: RequestMessageSampleDto) => requestMessageSample(dto));
