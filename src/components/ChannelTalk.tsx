import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import { useUserMe } from "@/hooks/queries/useUser";
import { useRouter } from "next/router";

export default function ChannelTalk() {
  const router = useRouter();
  const { data } = useUserMe();

  useEffect(() => {
    ChannelService.loadScript();

    const profile = data
      ? {
          memberId: data.id.toString(),
          memberHash: data.hash,
          profile: {
            name: data.name || "",
            email: data.email || "",
          },
          member: true,
        }
      : {
          member: false,
        };

    ChannelService.boot({
      pluginKey: "c293bdb7-4645-4d72-acd7-2f2919ebdc59",
      ...profile,
    });

    return () => {
      ChannelService.shutdown();
    };
  }, [data]);

  useEffect(() => {
    ChannelService.setPage(router.pathname);
  }, [router.pathname]);

  return <></>;
}
