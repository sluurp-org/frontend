import SubscriptionList from "./SubscriptionList";
import Billing from "./Billing";
import { Card } from "../common/Card";

export default function Subscription({ workspaceId }: { workspaceId: number }) {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-3">
      <Card id="subscription-billing" className="min-w-[300px] h-min">
        <Billing workspaceId={workspaceId} />
      </Card>
      <SubscriptionList workspaceId={workspaceId} />
    </div>
  );
}
