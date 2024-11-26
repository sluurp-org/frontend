import Calendar from "@/components/Calendar";
import { useChannel } from "@/contexts/ChannelContext";
import { useEffect } from "react";

export default function CalPage() {
  const channelTalk = useChannel();

  useEffect(() => {
    channelTalk?.hideChannelButton();
  });

  return <Calendar />;
}
