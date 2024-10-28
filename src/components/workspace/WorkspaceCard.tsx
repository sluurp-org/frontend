import { useRouter } from "next/router";

export default function WorkspaceCard({
  id,
  name,
  createdAt,
}: {
  id: number;
  name: string;
  createdAt: string;
}) {
  const router = useRouter();

  return (
    <div
      className="p-6 h-min w-max-[300px] cursor-pointer hover:shadow-lg border duration-75 bg-white rounded-md shadow-sm"
      onClick={() => router.push(`/workspaces/${id}`)}
    >
      <h2 className="text-lg font-bold text-gray-800">{name}</h2>
      <p className="text-gray-400 text-sm mt-3">
        생성일: {new Date(createdAt).toLocaleDateString("ko-KR")}
      </p>
    </div>
  );
}
