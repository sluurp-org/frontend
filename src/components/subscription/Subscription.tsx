import { useRouter } from "next/router";
import SubscriptionCurrent from "./SubscriptionCurrent";
import SubscriptionList from "./SubscriptionList";
import Billing from "./Billing";

export default function Subscription({ workspaceId }: { workspaceId: number }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mb-6 xl:w-[700px]">
        <SubscriptionCurrent workspaceId={workspaceId} />
        <Billing workspaceId={workspaceId} />
      </div>
      <SubscriptionList workspaceId={workspaceId} />
    </div>
  );
}
