import useSWR from "swr";
import Component from "../../components/Container";
import { WorkspaceAPI } from "../api/workspace";
import { useRouter } from "next/router";
import errorHandler from "@/utils/error";
import WorkspaceCard from "@/components/workspace/WorkspaceCard";
import Header from "@/components/Header";

export default function Workspaces() {
  const router = useRouter();
  const { data, error } = useSWR("/workspace", () => WorkspaceAPI.findMany());

  if (error) {
    errorHandler(error, router);
  }

  if (!data) {
    return <Component>로딩 중...</Component>;
  }

  console.log(data);

  return (
    <Component>
      <Header title="워크스페이스" description="워크스페이스 목록" />
      <div className="grid gap-8 sm:grid-cols-3">
        {data.map((workspace) => (
          <WorkspaceCard key={workspace.id} {...workspace} />
        ))}
      </div>
    </Component>
  );
}
