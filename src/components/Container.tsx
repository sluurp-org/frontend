import Footer from "./main/Footer";
import Sidebar from "./sidebar/Sidebar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen sm:flex flex-none h-screen">
      <Sidebar />
      <div className="overflow-y-auto h-[calc(100vh-60px)] sm:h-auto sm:w-[calc(100vw-270px)] w-screen p-7 sm:p-14 bg-gray-50">
        <div className="flex flex-col justify-between h-full">
          <div>{children}</div>
          <Footer
            logo={false}
            className="border-none py-0 mt-10 pb-5"
            childrenClassName="max-w-full text-xs"
          />
        </div>
      </div>
    </div>
  );
}
