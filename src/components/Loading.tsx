import { LoadingOutlined } from "@ant-design/icons";
import Container from "./Container";

export default function Loading({
  isFullPage = true,
}: {
  isFullPage?: boolean;
}) {
  return (
    <>
      {isFullPage ? (
        <Container>
          <div className="flex items-center justify-center h-full">
            <LoadingOutlined className="text-5xl text-indigo-400" />
          </div>
        </Container>
      ) : (
        <div className="flex items-center justify-center h-full">
          <LoadingOutlined className="text-5xl text-indigo-400" />
        </div>
      )}
    </>
  );
}
