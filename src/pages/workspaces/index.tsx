import Component from "../../components/Container";
import { useRouter } from "next/router";
import errorHandler from "@/utils/error";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import Header from "@/components/Header";
import { useWorkspaces } from "@/hooks/queries/useWorkspace";
import { Alert, Button } from "antd";
import WorkspaceModal from "@/components/workspace/WorkspaceModal";
import { useState } from "react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function Workspaces() {
  const { data, isLoading, error } = useWorkspaces();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error) {
    toast.error(errorHandler(error));
  }

  return (
    <Component>
      <WorkspaceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Header title="워크스페이스" description="워크스페이스 목록" />
      {data?.length === 0 && (
        <Alert
          message={
            "워크스페이스가 없습니다.\n워크스페이스를 생성하고 메시지 발송을 시작해보세요."
          }
          icon={<InfoCircleOutlined />}
          showIcon
          className="mb-3 whitespace-pre-line"
        />
      )}
      <Button
        type="primary"
        className="hover:shadow-sm"
        onClick={() => setIsModalOpen(true)}
      >
        워크스페이스 생성
      </Button>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4">
        {data?.map((workspace) => (
          <WorkspaceCard key={workspace.id} {...workspace} />
        ))}
      </div>
    </Component>
  );
}
