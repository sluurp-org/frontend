import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function Calendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "meeting" });
      cal("ui", {
        hideEventTypeDetails: false,
      });
    })();
  }, []);

  return (
    <Cal
      className="w-full bg-[#F9FAFB] shadow-none border-none"
      namespace="meeting"
      calLink="sluurp/meeting"
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
