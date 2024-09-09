import { StoreType } from "@/types/store";
import { useRouter } from "next/router";
import Image from "next/image";

export default function StoreCard({
  workspaceId,
  id,
  name,
  type,
  enabled,
}: {
  workspaceId: number;
  id: number;
  name: string;
  type: StoreType;
  enabled: boolean;
}) {
  const router = useRouter();

  const storeName =
    type === StoreType.SMARTSTORE ? "네이버 스마트스토어" : "알 수 없음";
  const storeIcon =
    type === StoreType.SMARTSTORE ? "/store/smartstore.png" : "";

  return (
    <div
      className="flex gap-3 p-6 cursor-pointer hover:shadow-xl hover:bg-gray-100 duration-75 bg-white rounded-lg shadow-md"
      onClick={() => router.push(`/workspaces/${workspaceId}/store/${id}`)}
    >
      <div className="flex-col content-center text-center mr-2 w-12">
        <Image
          src={storeIcon}
          alt="스토어 아이콘"
          width={100}
          height={100}
          className="w-12 h-12 rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block mx-auto w-2 h-2 rounded-full ${
              enabled ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          ></span>{" "}
          <h2 className="inline-block text-lg font-bold text-gray-800">
            {name}
          </h2>
        </div>
        <p className="text-gray-400 text-sm">{storeName}</p>
      </div>
    </div>
  );
}
