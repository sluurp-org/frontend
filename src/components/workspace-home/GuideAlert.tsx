import { Button } from "antd";
import { LinkOutlined, PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useChannel } from "@/contexts/ChannelContext";
import { Card } from "../common/Card";

export default function GuideAlert() {
  const ChannelService = useChannel();

  return (
    <Card className="min-h-[240px] justify-between flex flex-col">
      <div>
        <p className="text-lg font-bold">이용 안내</p>
        <p>스르륵을 더욱더 편리하게 사용하기 위한 가이드를 제공하고 있어요!</p>
        <p>아래 버튼을 통해 이용 가이드를 확인해보세요! ☺️</p>
      </div>
      <div className="w-full flex flex-col gap-2 mt-5">
        <Link target="_blank" href={`https://docs.sluurp.io`}>
          <Button type="primary" className="w-full" icon={<LinkOutlined />}>
            이용 가이드 보러가기
          </Button>
        </Link>
        <Button
          className="w-full"
          type="primary"
          icon={<PhoneOutlined />}
          onClick={() => ChannelService.openChat()}
        >
          고객센터 문의하기
        </Button>
      </div>
    </Card>
  );
}
