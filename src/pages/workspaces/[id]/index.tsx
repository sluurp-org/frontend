import Component from "@/components/Container";
import Header from "@/components/Header";
import WorkspaceDrawer from "@/components/workspace/WorkspaceDrawer";
import { useState } from "react";
import { Button } from "antd";
import { useTour } from "@/components/common/TourContext";
import { useRouter } from "next/router";

export default function Workspace() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const workspaceId = router.query.id;

  const { startTour } = useTour();
  const test = () => {
    startTour(
      [
        {
          target: "#setting-sidebar-button",
          content: "Page 1의 첫 단계입니다!",
          data: {
            next: `/workspaces/${workspaceId}/setting`,
          },
          disableBeacon: true,
          disableScrolling: true,
        },
        {
          target: "#subscription-current",
          content: "다음 페이지로 이동합니다.",
          data: {
            prev: true,
            next: `/workspaces/${workspaceId}/setting`,
          },
        },
      ],
      "home"
    );
    console.log("test");
  };

  return (
    <Component>
      <WorkspaceDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <Header title="워크스페이스" description="워크스페이스 홈" />
      <Button onClick={test}>투어 시작</Button>
    </Component>
  );
}
