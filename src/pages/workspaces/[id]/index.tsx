import Component from "@/components/Container";
import Header from "@/components/Header";
import WorkspaceDrawer from "@/components/workspace/WorkspaceDrawer";
import { useContext, useState } from "react";
import SubscriptionAlert from "@/components/workspace-home/SubscriptionAlert";
import { useRouter } from "next/router";
import StoreAlert from "@/components/workspace-home/StoreAlert";
import CreditCurrent from "@/components/setting/CreditCurrent";
import { Card } from "@/components/common/Card";
import SubscriptionCurrent from "@/components/subscription/SubscriptionCurrent";
import Link from "next/link";
import GuideAlert from "@/components/workspace-home/GuideAlert";
import { Button } from "antd";
import { useChannel } from "@/contexts/ChannelContext";
import { PhoneOutlined } from "@ant-design/icons";

export default function Workspace() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const ChannelService = useChannel();

  const router = useRouter();
  const workspaceId = Number(router.query.id);

  return (
    <Component>
      <WorkspaceDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <Header title="워크스페이스 홈" description="워크스페이스 홈" />
      <SubscriptionAlert workspaceId={workspaceId} />
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Link target="_blank" href={`https://docs.sluurp.io`}>
          <Card className="min-h-[240px] cursor-pointer">
            <GuideAlert />
          </Card>
        </Link>
        <StoreAlert workspaceId={workspaceId} />
        <Link href={`/workspaces/${workspaceId}/setting?tab=credit`}>
          <Card className="relative min-h-[240px] hover:shadow-lg duration-100">
            <CreditCurrent workspaceId={workspaceId} />
          </Card>
        </Link>
        <Link href={`/workspaces/${workspaceId}/setting?tab=subscription`}>
          <Card className="min-h-[240px] hover:shadow-lg duration-100">
            <SubscriptionCurrent workspaceId={workspaceId} showButton={false} />
          </Card>
        </Link>
        <Card className="min-h-[240px] hover:shadow-lg duration-100">
          <p className="text-lg font-bold">
            <PhoneOutlined className="mr-1" /> 고객센터 문의
          </p>
          <p className="text-gray-400">
            스르륵을 이용하시면서 궁금하신 점이나 개선 사항이 있으신가요? 아래
            고객센터 문의하기 버튼을 통해 고객센터로 연락해주세요 :)
          </p>
          <Button
            className="mt-3"
            type="primary"
            icon={<PhoneOutlined />}
            onClick={() => ChannelService.openChat()}
          >
            고객센터 문의하기
          </Button>
        </Card>
      </div>
    </Component>
  );
}
