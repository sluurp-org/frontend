import { useRouter } from "next/router";
import CreditList from "./CreditList";
import CreditCharge from "./CreditCharge";
import CreditCurrent from "./CreditCurrent";

export default function Credit({ workspaceId }: { workspaceId: number }) {
  const router = useRouter();

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 mb-6 xl:w-[700px]">
        <CreditCurrent workspaceId={workspaceId} />
        <CreditCharge workspaceId={workspaceId} />
      </div>
      <CreditList workspaceId={workspaceId} />
    </div>
  );
}
