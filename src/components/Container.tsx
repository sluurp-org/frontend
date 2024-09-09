import Sidebar from "./sidebar/Sidebar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen sm:flex flex-none h-screen">
      <Sidebar />
      <div className="overflow-y-auto h-[calc(100vh-60px)] sm:h-auto sm:w-[calc(100vw-270px)] w-screen p-7 sm:p-14 bg-stone-50">
        {children}
      </div>
    </div>
  );
}
