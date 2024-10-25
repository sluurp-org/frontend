import { useBilling } from "@/hooks/queries/useBilling";
import { Alert, Button, Modal, Popover } from "antd";
import Loading from "../Loading";
import Error from "../Error";
import errorHandler from "@/utils/error";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useAdditionalPayment,
  useCreateWorkspaceSubscription,
  useSubscriptions,
  useUpdateWorkspaceSubscription,
} from "@/hooks/queries/useSubscription";
import { SubscriptionDto } from "@/types/subscription";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export function SubscriptionItem({
  workspaceId,
  onClick,
  isCurrent,
  isSubscribed,
  disabled,
  subscription,
  isFree,
}: {
  workspaceId: number;
  onClick: () => void;
  isCurrent: boolean;
  isSubscribed: boolean;
  disabled: boolean;
  subscription: SubscriptionDto;
  isFree: boolean;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const {
    data: additionalSubscriptionPrice,
    refetch: refetchAdditionalPayment,
  } = useAdditionalPayment(workspaceId, subscription.id);

  const {
    isContentEnabled,
    storeLimit,
    contentLimit,
    messageLimit,
    alimTalkCredit,
    contentCredit,
  } = subscription;

  const sendPrice = [
    {
      name: "알림톡",
      price: alimTalkCredit,
    },
    {
      name: "디지털 콘텐츠",
      price: contentCredit,
    },
  ];

  const features = [
    { value: "1분 간격 주문 수집", isEnabled: true },
    { value: "제한 없는 주문 처리", isEnabled: true },
    {
      value: "최대 3분이내 메세지 발송",
      isEnabled: true,
    },
    storeLimit > 0
      ? {
          value: `최대 ${storeLimit}개 스토어 연동 가능`,
          isEnabled: true,
        }
      : { value: "스토어 무제한 연동", isEnabled: true },
    messageLimit > 0
      ? {
          value: `최대 ${messageLimit}개 메시지 등록 가능`,
          isEnabled: true,
        }
      : { value: "메시지 무제한 등록", isEnabled: true },
    isContentEnabled
      ? contentLimit > 0
        ? {
            value: `디지털 콘텐츠 최대 ${contentLimit}개 등록 가능`,
            isEnabled: true,
          }
        : { value: "디지털 콘텐츠 무제한 등록", isEnabled: true }
      : { value: "디지털 콘텐츠 등록 불가", isEnabled: false },
  ];

  useEffect(() => {
    refetchAdditionalPayment();
  }, [popoverOpen, refetchAdditionalPayment]);

  return (
    <div className="p-5 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">{subscription.name}</p>
          <p className="text-sm text-gray-500">
            {subscription.price.toLocaleString("ko-KR")}원
          </p>
        </div>
        <Popover
          title="구독하기"
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          trigger="click"
          content={
            <div>
              <p className="mb-2">
                {isSubscribed
                  ? "플랜을 정말 변경하시겠습니까?"
                  : "플랜을 정말 시작하시겠습니까?"}
                {additionalSubscriptionPrice &&
                additionalSubscriptionPrice > 0 ? (
                  <p className="text-sm text-gray-500">
                    추가 결제 금액은{" "}
                    {additionalSubscriptionPrice.toLocaleString()}원 입니다.
                  </p>
                ) : null}
              </p>

              <div className="flex gap-2 w-full">
                <Button className="w-full" type="primary" onClick={onClick}>
                  {isSubscribed ? "플랜 변경" : "플랜 시작"}
                </Button>
                <Button
                  className="w-full"
                  danger
                  onClick={() => setPopoverOpen(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          }
        >
          <Button type="primary" disabled={disabled || isCurrent}>
            {isCurrent ? "현재 구독중" : isFree ? "무료 체험 시작" : "구독하기"}
          </Button>
        </Popover>
      </div>
      <div className="mt-5">
        <p className="text-indigo-500 text-lg font-bold mb-1">플랜 기능</p>
        <div className="flex flex-col gap-1">
          {features.map((feature) => (
            <div key={feature.value} className="flex items-center gap-2">
              <span
                className={`${
                  feature.isEnabled ? "text-green-400" : "text-red-500"
                }`}
              >
                {feature.isEnabled ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )}
              </span>
              <span>{feature.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-indigo-500 text-lg font-bold mb-1">
          메세지 발송 요금
        </p>
        <ul className="list-disc list-inside">
          {sendPrice.map((price) => (
            <li key={price.name}>
              {price.name} 발송당 {price.price.toLocaleString("ko-KR")}원
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CreateSubscriptionModal({
  open,
  onClose,
  workspaceId,
  currentSubscriptionId,
  isSubscribed,
  isFree,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: number;
  currentSubscriptionId?: number;
  isSubscribed: boolean;
  isFree: boolean;
}) {
  const {
    data: billing,
    isLoading: billingLoading,
    error: billingError,
  } = useBilling(workspaceId);

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscriptions();

  const { mutateAsync: createWorkspaceSubscription } =
    useCreateWorkspaceSubscription(workspaceId);
  const { mutateAsync: updateWorkspaceSubscription } =
    useUpdateWorkspaceSubscription(workspaceId);

  if (billingError || subscriptionError) {
    errorHandler(billingError || subscriptionError);
    return <Error isFullPage={false} />;
  }

  if (billingLoading || subscriptionLoading)
    return <Loading isFullPage={false} />;

  const createSubscription = async (subscriptionId: number) => {
    if (isSubscribed) {
      toast.promise(updateWorkspaceSubscription(subscriptionId), {
        loading: "플랜 변경중...",
        success: "플랜 변경 완료",
        error: (error) => {
          return error.response?.data.message || errorHandler(error);
        },
      });
      onClose();
    } else {
      toast.promise(createWorkspaceSubscription(subscriptionId), {
        loading: "플랜 정보를 생성중...",
        success: "플랜이 시작되었습니다.",
        error: (error) => {
          return error.response?.data.message || errorHandler(error);
        },
      });
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title="구독 변경"
      onCancel={onClose}
      destroyOnClose
      footer={null}
    >
      {!billing && (
        <Alert
          message="카드 정보가 없습니다. 카드를 먼저 등록해주세요."
          type="error"
          icon={<ExclamationCircleOutlined />}
          showIcon
          className="mb-4"
        />
      )}
      <p className="text-lg font-bold mb-2 mt-4">구독 가능한 플랜</p>
      <div className="flex flex-col gap-2">
        {subscription?.map((subscription) => (
          <SubscriptionItem
            key={subscription.id}
            workspaceId={workspaceId}
            disabled={!billing}
            subscription={subscription}
            isFree={isFree}
            isSubscribed={isSubscribed}
            isCurrent={currentSubscriptionId === subscription.id}
            onClick={() => createSubscription(subscription.id)}
          />
        ))}
      </div>
    </Modal>
  );
}
