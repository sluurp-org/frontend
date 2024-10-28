import { useWorkspaceSubscription } from "@/hooks/queries/useSubscription";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button } from "antd";
import Link from "next/link";

export default function SubscriptionAlert({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const { data: subscription } = useWorkspaceSubscription(workspaceId);

  return (
    <>
      {!subscription?.currentSubscription && (
        <Alert
          message={
            <div className="py-1 px-2">
              <p>
                서비스를 이용하기 위해서는 구독이 필요합니다. 최초 30일간 무료로
                이용해보실 수 있습니다.
              </p>
              <p className="mb-2">아래 버튼을 눌러 구독을 진행해주세요.</p>
              <Link href={`/workspaces/${workspaceId}/setting`}>
                <Button>구독하기</Button>
              </Link>
            </div>
          }
          showIcon
          icon={<InfoCircleOutlined />}
          type="error"
          className="mb-3"
        />
      )}
    </>
  );
}
