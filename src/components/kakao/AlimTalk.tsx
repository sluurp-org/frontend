import Image from "next/image";
import AlimTalkHeader from "./AlimTalkHeader";
import AlimTalkButton, { AlimTalkButtonProps } from "./AlimTalkButton";

interface AlimTalkProps {
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
  return (
    <div
      className={
        "w-[280px] shadow-lg font-han-sans relative select-none rounded-lg h-min " +
        className
      }
    >
      <AlimTalkHeader />
      {image && <Image src={image} width={280} height={280} alt="배송시작" />}
      <div className="mx-4 my-4 bg-white break-all rounded-b-md">
        <p className="text-sm text-black whitespace-pre-wrap break-words">
          {content}
        </p>
        <p className="mt-3 text-gray-400 text-[13px]">
          {extra}
          {extra && channelAddButton && <br />}
          {channelAddButton &&
            "채널 추가하고 이 채널의 광고와 마케팅 메시지를 카카오톡으로 받기"}
        </p>
      </div>
      <div className="mx-4 mb-4 flex-col flex gap-2 bg-white rounded-b-md">
        {channelAddButton && <AlimTalkButton isChannelAddButton={true} />}
        {buttons?.map((button, index) => (
          <AlimTalkButton key={index} {...button} />
        ))}
      </div>
    </div>
  );
}