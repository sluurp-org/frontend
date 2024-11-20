"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Default() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/notice/14301e85453080828d67e19398b011a2`);
  }, [router]);

  return <></>;
}
