import { AnalyticsQueryDto, DailyAanlytics } from "@/types/analytics";
import axiosClient from "@/utils/axios";
import { useQuery } from "react-query";

const fetchDailyWorkspaceAnalytics = async (
  workspaceId: number,
  dto: AnalyticsQueryDto
) => {
  const { data } = await axiosClient.get<DailyAanlytics>(
    `/workspace/${workspaceId}/analytics/daily`,
    {
      params: dto,
    }
  );

  return data;
};

const fetchMonthlyWorkspaceAnalytics = async (
  workspaceId: number,
  dto: AnalyticsQueryDto
) => {
  const { data } = await axiosClient.get(
    `/workspace/${workspaceId}/analytics/monthly`,
    {
      params: dto,
    }
  );

  return data;
};

const fetchDailyStoreAnalytics = async (
  workspaceId: number,
  storeId: number,
  dto: AnalyticsQueryDto
) => {
  const { data } = await axiosClient.get(
    `/workspace/${workspaceId}/analytics/${storeId}/daily`,
    {
      params: dto,
    }
  );

  return data;
};

const fetchMonthlyStoreAnalytics = async (
  workspaceId: number,
  storeId: number,
  dto: AnalyticsQueryDto
) => {
  const { data } = await axiosClient.get(
    `/workspace/${workspaceId}/analytics/${storeId}/monthly`,
    {
      params: dto,
    }
  );

  return data;
};

export const useDailyWorkspaceAnalytics = (
  workspaceId: number,
  dto: AnalyticsQueryDto
) => {
  return useQuery(
    ["dailyWorkspaceAnalytics", workspaceId, dto],
    () => fetchDailyWorkspaceAnalytics(workspaceId, dto),
    {
      enabled: !!workspaceId,
    }
  );
};

export const useMonthlyWorkspaceAnalytics = (
  workspaceId: number,
  dto: AnalyticsQueryDto
) => {
  return useQuery(["monthlyWorkspaceAnalytics", workspaceId], () =>
    fetchMonthlyWorkspaceAnalytics(workspaceId, dto)
  );
};

export const useDailyStoreAnalytics = (
  workspaceId: number,
  storeId: number
) => {
  return useQuery(["dailyStoreAnalytics", workspaceId, storeId], () =>
    fetchDailyStoreAnalytics(workspaceId, storeId, {
      startDate: new Date(),
      endDate: new Date(),
    })
  );
};

export const useMonthlyStoreAnalytics = (
  workspaceId: number,
  storeId: number
) => {
  return useQuery(["monthlyStoreAnalytics", workspaceId, storeId], () =>
    fetchMonthlyStoreAnalytics(workspaceId, storeId, {
      startDate: new Date(),
      endDate: new Date(),
    })
  );
};
