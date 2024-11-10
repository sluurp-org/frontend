import Image from "next/image";
import AlimTalkHeader from "./AlimTalkHeader";
import AlimTalkButton, { AlimTalkButtonProps } from "./AlimTalkButton";
import { Tag } from "antd";

export interface AlimTalkProps {
  className?: string;
  content: string;
  image?: string;
  extra?: string;
  channelAddButton?: boolean;
  buttons?: AlimTalkButtonProps[];
}

export default function AlimTalk({
  className,
  content,
  image,
  extra,
  channelAddButton,
  buttons,
}: AlimTalkProps) {
  const renderContent = (content?: string) => {
    return content?.split(/(\#\{.*?\})/).map((part, index) => {
      if (part.match(/\#\{(.*?)\}/)) {
        const labelText = part.replace(/\#\{(.*?)\}/, "$1"); // 중괄호 내부 텍스트 추출
        if (labelText === "") return part;

        return (
          <Tag className="m-0" color="green" key={index}>
            {labelText}
          </Tag>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={
        "w-[280px] bg-white shadow-lg font-han-sans relative select-none rounded-lg " +
        className
      }
    >
      <div className="pb-4">
        <AlimTalkHeader />
        {image && <Image src={image} width={280} height={280} alt="이미지" />}
        <div className="mx-4 my-4 bg-white break-all rounded-b-md">
          <p className="text-sm text-black whitespace-pre-wrap break-words">
            {renderContent(content)}
          </p>
          <p className="mt-3 text-gray-400 text-[13px] whitespace-pre-wrap break-words">
            {extra}
            {channelAddButton && (
              <>
                {extra && <div className="mt-2" />}
                <span>
                  채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로
                  받기
                </span>
              </>
            )}
          </p>
        </div>
        <div className="mx-4 flex-col flex gap-2 bg-white rounded-b-md">
          {channelAddButton && <AlimTalkButton isChannelAddButton={true} />}
          {buttons?.map((button, index) => (
            <AlimTalkButton key={index} {...button} />
          ))}
        </div>
      </div>
    </div>
  );
}
