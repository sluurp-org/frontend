import { cn } from "@/lib/utils";

export function Card({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "bg-white border border-gray-200 rounded-lg shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
