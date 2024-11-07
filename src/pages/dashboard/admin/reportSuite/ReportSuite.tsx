import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGetTodaysSaleAdminReportQuery } from "@/store/api/adminReport/adminReportApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useState } from "react";
import { LuDownload } from "react-icons/lu";
interface IReportSuite {}

const ReportSuite: FC<IReportSuite> = () => {
  const { translate } = useCustomTranslator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const { data: salesData, isLoading: salesLoading } =
    useGetTodaysSaleAdminReportQuery({});
  console.log("salesData", salesData);
  const totalItems = salesData?.data?.todaySalesHistory?.length || 0;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) =>
        totalItems > 0 // Check if there are items before calculating the index
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    {
      accessorKey: "id",
      header: translate("সেল আইডি", "Sale ID"),
    },
    {
      accessorKey: "order.customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
    },
    {
      accessorKey: "seat",
      header: translate("আসন", "Seat"),
    },
    {
      accessorKey: "paymentMethod",
      header: translate("পেমেন্ট পদ্ধতি", "Payment Method"),
    },
    {
      accessorKey: "status",
      header: translate("স্ট্যাটাস", "Status"),
    },
    {
      accessorKey: "unitPrice",
      header: translate("ইউনিট মূল্য", "Unit Price"),
    },
    {
      accessorKey: "createdAt",
      header: translate("তৈরির তারিখ", "Created At"),
      //@ts-ignore
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
  ];
  if (salesLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      {/* sales information */}
      <div className="grid grid-cols-5 gap-5 my-5">
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesData?.data?.todaySales !== 0
                ? salesData?.data?.todaySales
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Online Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesData?.data?.todayOnlineSales !== 0
                ? salesData?.data?.todayOnlineSales
                : 0}
            </h2>
          </div>
        </PageTransition>{" "}
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Offline Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesData?.data?.todayOfflineTicketCount !== 0
                ? salesData?.data?.todayOfflineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Cancel Tickit</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesData?.data?.todayCancelTicketCount !== 0
                ? salesData?.data?.todayCancelTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Online Tickit</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesData?.data?.todayOnlineTicketCount !== 0
                ? salesData?.data?.todayOnlineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
      </div>
      {/* sales information */}
      <TableWrapper
        subHeading={translate(
          "আজকের সেলস তথ্য উপাত্ত",
          "Today's Sales Information"
        )}
        heading={translate("আজকের সেলস", "Today's Sales")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "PDF")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={salesData?.data?.todaySalesHistory || []} // Passing sales history data
        />
      </TableWrapper>
    </PageWrapper>
  );
};
export default ReportSuite;
