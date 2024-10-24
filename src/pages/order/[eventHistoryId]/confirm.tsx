import UserEventContainer from "@/components/user-event/UserEventContainer";
import { useUserEventHistoryConfirm } from "@/hooks/queries/useUserEventHistory";
import { Button, Result } from "antd";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ConfirmOrderRedirect() {
  const router = useRouter();
  const { eventHistoryId } = router.query;

  const { data, isLoading, error } = useUserEventHistoryConfirm(
    eventHistoryId as string
  );

  useEffect(() => {
    if (data && data.url) {
      window.location.href = data.url;
    }
  }, [data]);

  if (!isLoading && error) {
    return (
      <UserEventContainer>
        <Result
          status="error"
          title="주문 정보를 불러올 수 없습니다."
          subTitle={isAxiosError(error) ? error.response?.data.message : ""}
        />
        <p className="text-sm text-gray-500">
          오류라고 판단될 시 우측 하단 고객센터로 문의 부탁드립니다.
        </p>
      </UserEventContainer>
    );
  }
}
