import SubscriptionList from "./SubscriptionList";
import Billing from "./Billing";
import { Card } from "../common/Card";
import SubscriptionCurrent from "./SubscriptionCurrent";

export default function Subscription({ workspaceId }: { workspaceId: number }) {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-3">
      <div className="flex gap-3 flex-col">
        <Card id="subscription-billing" className="min-w-[300px] h-min">
          <Billing workspaceId={workspaceId} />
        </Card>
        <Card id="subscription-billing" className="min-w-[300px] h-min">
          <SubscriptionCurrent workspaceId={workspaceId} />
        </Card>
      </div>
      <SubscriptionList workspaceId={workspaceId} />
    </div>
  );
}
