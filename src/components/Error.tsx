import Container from "./Container";
import { Button, Result } from "antd";
import Link from "next/link";

export default function Error({
  isFullPage = true,
  message = "에러가 발생하였습니다.\n잠시 후 다시 시도해주세요.",
}: {
  isFullPage?: boolean;
  message?: string;
}) {
  return (
    <>
      {isFullPage ? (
        <Container>
          <div className="flex items-center justify-center h-full">
            <Result
              status="error"
              title="에러가 발생했습니다."
              subTitle={message}
              extra={
                <Link href={"/workspaces"}>
                  <Button>홈으로 돌아가기</Button>
                </Link>
              }
            />
          </div>
        </Container>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Result
            status="error"
            title="에러가 발생했습니다."
            subTitle={message}
            extra={
              <Link href={"/workspaces"}>
                <Button>홈으로 돌아가기</Button>
              </Link>
            }
          />
        </div>
      )}
    </>
  );
}
