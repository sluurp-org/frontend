import { Card } from "../common/Card";
import Link from "next/link";
import { Alert, Button } from "antd";
import { InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { useBilling } from "@/hooks/queries/useBilling";

export default function BillingAlert({ workspaceId }: { workspaceId: number }) {
  const { data: billing, isLoading } = useBilling(workspaceId);

  const isBillingFound = billing && !isLoading;
  if (isBillingFound) return null;

  return (
    <Card className="min-h-[240px] flex flex-col justify-between">
      <div>
        <p className="text-lg font-bold text-red-400">카드 등록 안내</p>
        <Alert
          message={
            "결제를 위해 카드를 먼저 등록해주세요. 등록하지 않을경우 스토어 연결이 불가능합니다."
          }
          showIcon
          className="mt-3"
          icon={<InfoCircleOutlined />}
          type="error"
        />
      </div>
      <Link href={`/workspaces/${workspaceId}/setting?tab=purchase`}>
        <Button type="primary" className="mt-3 w-full" icon={<LinkOutlined />}>
          카드 등록하기
        </Button>
      </Link>
    </Card>
  );
}
