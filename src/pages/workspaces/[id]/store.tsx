import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Component from "../../../components/Container";
import Header from "@/components/Header";
import StoreCard from "@/components/store/StoreCard";
import { SearchOutlined } from "@ant-design/icons";
import { FilterStoreType } from "@/types/store";
import { SearchStoreQueryDto } from "@/types/store.dto";
import useDebounce from "@/hooks/useDebounce";
import errorHandler from "@/utils/error";
import { StoreAPI } from "@/pages/api/store";

const parseQuery = (query) => ({
  workspaceId: query.id as string,
  ...query,
});

const useStoreData = (workspaceId, filter) => {
  const debouncedFilter = useDebounce(filter);
  const { data, error, mutate } = useSWR(
    workspaceId ? `/workspace/${workspaceId}/store` : null,
    () => StoreAPI.findMany(workspaceId, debouncedFilter),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (workspaceId) mutate();
  }, [debouncedFilter, mutate, workspaceId]);

  return { data, error };
};

export default function Store() {
  const router = useRouter();
  const query = parseQuery(router.query);
  const workspaceId = parseInt(query.workspaceId);
  const [filter, setFilter] = useState(query);

  const { data, error } = useStoreData(workspaceId, filter);

  const onSearchChange = (e) => {
    setFilter((prevFilter) => ({ ...prevFilter, name: e.target.value }));
  };

  if (error) {
    errorHandler(error, router);
    return <Component>에러가 발생했습니다.</Component>;
  }

  if (!data) return <Component>로딩 중...</Component>;

  return (
    <Component>
      <Header title="스토어" description="스토어 목록" />
      <div className="flex-col">
        <button className="mr-3 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-xl shadow-sm cursor-pointer hover:shadow-lg duration-75">
          스토어 연동
        </button>
        <div className="flex gap-1">
          <div className="rounded-xl bg-white border-2 px-4 py-2 flex items-center">
            <SearchOutlined className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              onChange={onSearchChange}
              className="outline-none"
            />
          </div>
          <select
            className="rounded-xl bg-white border-2 px-4 py-2 cursor-pointer"
            onChange={(e) =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                type: e.target.value,
              }))
            }
          >
            <option value="">전체</option>
            {Object.entries(FilterStoreType).map(([key, value]) => (
              <option key={value} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {data.nodes.map((store) => (
          <StoreCard key={store.id} workspaceId={workspaceId} {...store} />
        ))}
      </div>
    </Component>
  );
}
