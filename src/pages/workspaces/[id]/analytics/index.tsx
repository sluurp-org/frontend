import Header from "@/components/Header";
import Component from "@/components/Container";
import { Card } from "@/components/common/Card";
import { useRouter } from "next/router";
import { Tabs, TabsProps } from "antd";
import WorkspaceSalesStatistics from "@/components/analytics/WorkspaceSalesStatistics";

export default function Analytics() {
  const router = useRouter();
  const workspaceId = Number(router.query.id);

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: key },
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "workspace-sales-statistics",
      label: "워크스페이스 매출 통계",
      children: <WorkspaceSalesStatistics workspaceId={workspaceId} />,
    },
    {
      key: "store-sales-statistics",
      label: "스토어별 매출 통계",
    },
  ];

  return (
    <Component>
      <Header title="통계" description="워크스페이스의 통계" />
      <Tabs
        items={items}
        onChange={handleTabChange}
        activeKey={router.query.tab as string}
      />
    </Component>
  );
}
