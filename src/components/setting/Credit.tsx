import { useRouter } from "next/router";
import CreditList from "./CreditList";
import CreditCharge from "./CreditCharge";
import CreditCurrent from "./CreditCurrent";
import { Card } from "../common/Card";

export default function Credit({ workspaceId }: { workspaceId: number }) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mb-6 xl:w-[700px]">
        <Card className="justify-between flex flex-col">
          <CreditCurrent workspaceId={workspaceId} />
        </Card>
        <Card>
          <CreditCharge workspaceId={workspaceId} />
        </Card>
      </div>
      <CreditList workspaceId={workspaceId} />
    </div>
  );
}
