import { useRouter } from "next/router";

export default function Default() {
  const router = useRouter();
  const { eventHistoryId } = router.query;

  if (eventHistoryId) router.push(`/order/${eventHistoryId}`);

  return <></>;
}
