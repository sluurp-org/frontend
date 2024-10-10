export default function Section({
  className,
  autoWidth = true,
  children,
}: {
  className?: string;
  autoWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={"flex items-center justify-center py-20 px-4 " + className}
    >
      <div
        className={`container mx-auto ${
          autoWidth ? "xl:w-10/12 2xl:w-6/12" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}
