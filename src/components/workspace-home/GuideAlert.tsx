import { Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";

export default function GuideAlert() {
  return (
    <>
      <p className="text-lg font-bold">이용 가이드 안내</p>
      <p className="text-gray-400">
        스르륵을 더욱더 편리하게 사용하기 위한 가이드를 제공하고 있어요!
      </p>
      <p className="text-gray-400">
        아래 버튼을 통해 이용 가이드를 확인해보세요! ☺️
      </p>
      <Button type="primary" className="mt-3" icon={<LinkOutlined />}>
        이용 가이드 보러가기
      </Button>
    </>
  );
}
