export interface AlimTalkButtonProps {
  isChannelAddButton?: boolean;
  buttonName?: string;
}

export default function AlimTalkButton({
  isChannelAddButton = false,
  buttonName = "버튼",
}: AlimTalkButtonProps) {
  return (
    <button
      className={`w-full p-2 text-[14px] rounded-md text-black ${
        !isChannelAddButton
          ? "bg-[#F6F7F8] border-[#F0F1F2] border-2 hover:bg-[#E9EAEB]"
          : "bg-[#FCE820] hover:bg-[#ffd11b]"
      }`}
    >
      {!isChannelAddButton ? buttonName : "채널 추가"}
    </button>
  );
}
