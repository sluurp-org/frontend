import { Tabs, TabsProps } from "antd";
import Component from "../../../components/Container";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import WorkspaceUpdate from "@/components/workspace/WorkspaceUpdate";
import Subscription from "@/components/subscription/Subscription";

export default function WorkspaceSetting() {
  const router = useRouter();
  const workspaceId = parseInt(router.query.id as string, 10);

  const handleTabChange = (key: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, tab: key },
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "purchase",
      label: "결제 관리",
      children: <Subscription workspaceId={workspaceId} />,
    },
    {
      key: "workspace",
      label: "워크스페이스 설정",
      children: <WorkspaceUpdate workspaceId={workspaceId} />,
    },
  ];

  return (
    <Component>
      <Header title="워크스페이스 설정" description="워크스페이스 설정" />
      <Tabs
        items={items}
        onChange={handleTabChange}
        activeKey={router.query.tab as string}
      />
    </Component>
  );
}
