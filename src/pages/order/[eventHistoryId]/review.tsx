import UserEventContainer from "@/components/user-event/UserEventContainer";
import { useUserEventHistoryReview } from "@/hooks/queries/useUserEventHistory";
import { Button, Result } from "antd";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ReviewOrderRedirect() {
  const router = useRouter();
  const { eventHistoryId } = router.query;

  const { data, isLoading, error } = useUserEventHistoryReview(
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

  return (
    <UserEventContainer isLoading={isLoading}>
      <h1 className="text-2xl font-bold">
        리뷰 작성 페이지로 이동하고 있습니다.
      </h1>
      <p className="text-sm text-gray-500">
        이동되지 않을 경우 아래 버튼을 눌러주세요.
      </p>
      <Button type="primary" className="mt-5">
        <Link href={data?.url || ""}>리뷰 작성 페이지로 이동</Link>
      </Button>
    </UserEventContainer>
  );
}
