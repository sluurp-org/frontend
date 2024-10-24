import { Tabs, TabsProps } from "antd";
import Component from "../../../components/Container";
import { useRouter } from "next/router";
import Credit from "@/components/setting/Credit";
import Header from "@/components/Header";
import WorkspaceUpdate from "@/components/workspace/WorkspaceUpdate";
import Subscription from "@/components/subscription/Subscription";

export default function WorkspaceSetting() {
  const router = useRouter();
  const workspaceId = parseInt(router.query.id as string, 10);

  const items: TabsProps["items"] = [
    {
      key: "subscription",
      label: "구독 관리",
      children: <Subscription workspaceId={workspaceId} />,
    },
    {
      key: "credit",
      label: "크레딧 관리",
      children: <Credit workspaceId={workspaceId} />,
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
      <Tabs items={items} />
    </Component>
  );
}
