import Component from "../../components/Container";
import { useRouter } from "next/router";
import errorHandler from "@/utils/error";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import Header from "@/components/Header";
import { useWorkspaces } from "@/hooks/queries/useWorkspace";
import { Button } from "antd";
import WorkspaceDrawer from "@/components/workspace/WorkspaceModal";
import { useState } from "react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function Workspaces() {
  const { data, isLoading, error } = useWorkspaces();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) {
    toast.error(errorHandler(error));
  }

  return (
    <Component>
      <WorkspaceDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <Header title="워크스페이스" description="워크스페이스 목록" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
        {data?.map((workspace) => (
          <WorkspaceCard key={workspace.id} {...workspace} />
        ))}
        <Button
          type="dashed"
          className="h-min-[200px] h-full text-indigo-500 border-indigo-500 hover:shadow-sm"
          onClick={() => setIsDrawerOpen(true)}
        >
          워크스페이스 생성
        </Button>
      </div>
    </Component>
  );
}
