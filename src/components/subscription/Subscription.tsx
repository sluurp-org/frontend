import SubscriptionCurrent from "./SubscriptionCurrent";
import SubscriptionList from "./SubscriptionList";
import Billing from "./Billing";
import { Card } from "../common/Card";

export default function Subscription({ workspaceId }: { workspaceId: number }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mb-6 xl:w-[700px]">
        <Card className="relative" id="subscription-current">
          <SubscriptionCurrent workspaceId={workspaceId} />
        </Card>
        <Card id="subscription-billing">
          <Billing workspaceId={workspaceId} />
        </Card>
      </div>
      <SubscriptionList workspaceId={workspaceId} />
    </div>
  );
}
