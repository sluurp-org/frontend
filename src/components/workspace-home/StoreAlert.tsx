import { useStore } from "@/hooks/queries/useStore";
import { Card } from "../common/Card";
import Link from "next/link";
import { Alert, Button } from "antd";
import {
  AlertOutlined,
  InfoCircleOutlined,
  LinkOutlined,
} from "@ant-design/icons";

export default function StoreAlert({ workspaceId }: { workspaceId: number }) {
  const { data: store } = useStore(workspaceId, {
    page: 1,
    size: 1,
  });

  const isStoreNotFound = store?.nodes.length === 0;
  if (!isStoreNotFound) return null;
  return (
    <Card className="min-h-[240px] flex flex-col justify-between">
      <div>
        <p className="text-lg font-bold text-red-400">스토어 연결 안내</p>
        <Alert
          message={
            " 스토어가 없어 주문을 수집할 수 없습니다. 스토어를 연결해주세요."
          }
          showIcon
          className="mt-3"
          icon={<InfoCircleOutlined />}
          type="error"
        />
      </div>
      <Link href={`/workspaces/${workspaceId}/store`}>
        <Button type="primary" className="mt-3 w-full" icon={<LinkOutlined />}>
          스토어 연결하기
        </Button>
      </Link>
    </Card>
  );
}
