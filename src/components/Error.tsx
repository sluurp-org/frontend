import { LoadingOutlined } from "@ant-design/icons";
import Container from "./Container";
import { Button, Result } from "antd";
import { useRouter } from "next/router";

export default function Error({
  isFullPage = true,
  message = "에러가 발생하였습니다.\n잠시 후 다시 시도해주세요.",
}: {
  isFullPage?: boolean;
  message?: string;
}) {
  const router = useRouter();

  const pushToHome = () => router.push("/");
  return (
    <>
      {isFullPage ? (
        <Container>
          <div className="flex items-center justify-center h-full">
            <Result
              status="error"
              title="에러가 발생했습니다."
              subTitle={message}
              extra={<Button onClick={pushToHome}>홈으로 돌아가기</Button>}
            />
          </div>
        </Container>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Result
            status="error"
            title="에러가 발생했습니다."
            subTitle={message}
            extra={<Button onClick={pushToHome}>홈으로 돌아가기</Button>}
          />
        </div>
      )}
    </>
  );
}
