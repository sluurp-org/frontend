"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Default() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/faq/14901e85453080b8a78bebf4f0155fd4`);
  }, [router]);

  return <></>;
}
