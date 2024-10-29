import { Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function GuideAlert() {
  return (
    <>
      <div>
        <p className="text-lg font-bold">이용 가이드 안내</p>
        <p>스르륵을 더욱더 편리하게 사용하기 위한 가이드를 제공하고 있어요!</p>
        <p>아래 버튼을 통해 이용 가이드를 확인해보세요! ☺️</p>
      </div>
      <Link target="_blank" href={`https://docs.sluurp.io`}>
        <Button type="primary" className="mt-3 w-full" icon={<LinkOutlined />}>
          이용 가이드 보러가기
        </Button>
      </Link>
    </>
  );
}
