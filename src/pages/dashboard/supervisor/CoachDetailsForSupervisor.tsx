import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Input } from "@/components/ui/input";
import { useGetSupervisorCoachDetailsQuery } from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import React, { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";
const CoachDetailsForSupervisor: React.FC = () => {
  const { translate } = useCustomTranslator();
  const { coachId } = useParams();
  const { data: coachDetailsData, isLoading: coachDetailsLoading } =
    useGetSupervisorCoachDetailsQuery(coachId);
  //
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  });
  const columns = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info: any) => {
        const rowIndex = info.row.index + 1 + (query.page - 1) * query.size;
        return <span>{rowIndex}</span>;
      },
    },
    {
      accessorKey: "counterName",
      header: translate("কাউন্টার নাম", "Counter Name"),
    },
    {
      accessorKey: "totalAmount",
      header: translate("মোট টাকা", "Total Taka"),
    },
  ];
  if (coachDetailsLoading) {
    return <TableSkeleton columns={10} />;
  }
  return (
    <PageWrapper>
      <h2 className="font-bold text-2xl py-5">
        {translate(
          `কোচ তথ্য উপাত্ত: ${coachDetailsData?.data?.coachInfo?.coachNo}`,
          `Coach Information Data: ${coachDetailsData?.data?.coachInfo?.coachNo}`
        )}
      </h2>
      <div className="grid grid-cols-4 gap-5 my-5">
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Available Seat:</h2>
            <h2 className="mt-3">Total: {coachDetailsData?.data.available}</h2>
          </div>
        </PageTransition>

        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Sold Seat:</h2>
            <h2 className="mt-3">Total: {coachDetailsData?.data?.soled}</h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Online Seat Booking:</h2>
            <h2 className="mt-3">
              Total: {coachDetailsData?.data?.onlineOrders?.totalSeat}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Online Total Sales:</h2>
            <h2 className="mt-3">
              Taka: {coachDetailsData?.data?.onlineOrders?.totalAmount}
            </h2>
          </div>
        </PageTransition>
      </div>

      <TableWrapper heading={translate("কাউন্টার বিবরণ", "Counter Details")}>
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                placeholder={translate("অনুসন্ধান", "Search")}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuery((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-[300px]"
              />
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachDetailsData?.data?.counterWiseReport || []}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CoachDetailsForSupervisor;
