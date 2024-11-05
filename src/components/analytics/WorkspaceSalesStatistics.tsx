import dynamic from "next/dynamic";
import { Card } from "../common/Card";
import { Select } from "antd";
export default function WorkspaceSalesStatistics({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
  // const { data: dailyAnalytics } = useDailyWorkspaceAnalytics(workspaceId, );

  return (
    <Card>
      <p className="text-lg font-bold mb-3">워크스페이스 매출 통계</p>
      <Select>
        <Select.Option value="daily">일간</Select.Option>
        <Select.Option value="weekly">주간</Select.Option>
        <Select.Option value="monthly">월간</Select.Option>
      </Select>
      <ApexChart
        options={{
          chart: {
            type: "line",
          },
          xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
        }}
        series={[
          {
            name: "매출",
            data: [30, 40, 35, 50, 49, 60, 70],
          },
        ]}
        type="line"
        height={350}
      />
    </Card>
  );
}
