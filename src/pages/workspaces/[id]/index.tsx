import Component from "@/components/Container";
import Header from "@/components/Header";
import WorkspaceDrawer from "@/components/workspace/WorkspaceModal";
import { useState } from "react";
import { useRouter } from "next/router";
import StoreAlert from "@/components/workspace-home/StoreAlert";
import GuideAlert from "@/components/workspace-home/GuideAlert";
import BillingAlert from "@/components/workspace-home/BillingAlert";

export default function Workspace() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const router = useRouter();
  const workspaceId = Number(router.query.id);

  return (
    <Component>
      <WorkspaceDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <Header title="워크스페이스 홈" description="워크스페이스 홈" />
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
        <GuideAlert />
        {/* <BillingAlert workspaceId={workspaceId} /> */}
        <StoreAlert workspaceId={workspaceId} />
      </div>
    </Component>
  );
}
