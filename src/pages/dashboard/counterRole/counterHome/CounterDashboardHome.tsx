import DashboardTickitBookingCard from "@/components/common/card/DashboardTickitBookingCard";
import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetSalesTickitListQuery } from "@/store/api/counter/counterSalesBookingApi";
import { selectCounterSearchFilter } from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useSelector } from "react-redux";
import CounterOrderDetailsModal from "../sales/CounterOrderDetailsModal";
import UpdateCounterOrderModal from "../sales/UpdateCounterOrderModal";

interface ISalesListProps {}
export interface ISalesDataStateProps {
  search: string;
  addUserOpen: boolean;
  updateModalOpeans: boolean;
  detailsModalOpen: boolean;
  usersList: Partial<any[]>;
  selectedOrderId: number | null;
}

const CounterDashboardHome: FC<ISalesListProps> = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  const bookingState = useSelector(selectCounterSearchFilter);

  const [salesTickitState, setSalesTickitState] =
    useState<ISalesDataStateProps>({
      search: "",
      addUserOpen: false,
      updateModalOpeans: false,
      detailsModalOpen: false,
      usersList: [],
      selectedOrderId: null,
    });

  // Fetch sales data using the API hook
  const { data: salesTickitList, isLoading: loadingSalesTickit } =
    useGetSalesTickitListQuery({
      search: salesTickitState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const handleUpdateClick = (orderId: number) => {
    setSalesTickitState((prev) => ({
      ...prev,
      updateModalOpeans: true,
      selectedOrderId: orderId,
    }));
  };

  const handleDetailsClick = (orderId: number) => {
    setSalesTickitState((prev) => ({
      ...prev,
      detailsModalOpen: true,
      selectedOrderId: orderId,
    }));
  };

  const closeUpdateModal = () => {
    setSalesTickitState((prev) => ({
      ...prev,
      updateModalOpeans: false,
      selectedOrderId: null,
    }));
  };

  const closeDetailsModal = () => {
    setSalesTickitState((prev) => ({
      ...prev,
      detailsModalOpen: false,
      selectedOrderId: null,
    }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => (query.page - 1) * query.size + info.row.index + 1,
    },
    { accessorKey: "id", header: translate("সেল আইডি", "Sale ID") },
    {
      accessorKey: "customerName",
      header: translate("গ্রাহকের নাম", "Customer Name"),
    },
    {
      accessorKey: "orderSeat",
      header: translate("আসন", "Seat"),
      cell: ({ row }) =>
        row.original.orderSeat?.map((s: any) => s.seat).join(", ") || "N/A",
    },
    {
      accessorKey: "dueAmount",
      header: translate("বকেয়া পরিমাণ", "Due Amount"),
    },
    {
      accessorKey: "paymentMethod",
      header: translate("পেমেন্ট পদ্ধতি", "Payment Method"),
    },
    { accessorKey: "status", header: translate("স্ট্যাটাস", "Status") },
    {
      accessorKey: "unitPrice",
      header: translate("ইউনিট মূল্য", "Unit Price"),
    },
    {
      accessorKey: "createdAt",
      header: translate("তৈরির তারিখ", "Created At"),
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <DropdownMenuLabel>
              {translate("কার্যক্রম", "Action")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button
              onClick={() => handleDetailsClick(row.original.id)}
              variant="outline"
              size="xs"
              className="w-full flex justify-start"
            >
              {translate("বিস্তারিত", "Details")}
            </Button>
            <Button
              onClick={() => handleUpdateClick(row.original.id)}
              variant="outline"
              size="xs"
              className="w-full flex justify-start"
            >
              {translate("পেমেন্ট করুন", "Pay")}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loadingSalesTickit) {
    return <TableSkeleton columns={7} />;
  }

  return (
    <PageWrapper>
      <div className="grid grid-cols-5 gap-5 my-5">
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesTickitList?.data?.todaySales !== 0
                ? salesTickitList?.data?.todaySales
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Online Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesTickitList?.data?.todayOnlineSales !== 0
                ? salesTickitList?.data?.todayOnlineSales
                : 0}
            </h2>
          </div>
        </PageTransition>{" "}
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Offline Sales</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesTickitList?.data?.todayOfflineTicketCount !== 0
                ? salesTickitList?.data?.todayOfflineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Cancel Tickit</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesTickitList?.data?.todayCancelTicketCount !== 0
                ? salesTickitList?.data?.todayCancelTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
        <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <div className="p-6 flex flex-col justify-start items-start w-full">
            <h2>Todays Online Tickit</h2>
            <h2 className="mt-3">
              Total:{" "}
              {salesTickitList?.data?.todayOnlineTicketCount !== 0
                ? salesTickitList?.data?.todayOnlineTicketCount
                : 0}
            </h2>
          </div>
        </PageTransition>
      </div>
      {/* search design  */}
      <div>
        {bookingState.bookingCoachesList.length > 0 && (
          <Accordion className="w-full" type="single" collapsible>
            {bookingState?.bookingCoachesList.map(
              (singleCoachData: any, coachDataIndex: number) => (
                <DashboardTickitBookingCard
                  key={coachDataIndex}
                  coachData={singleCoachData}
                  index={coachDataIndex}
                />
              )
            )}
          </Accordion>
        )}
      </div>

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
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSalesTickitState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="w-[300px]"
                placeholder={translate("search", "search")}
              />
            </li>
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
          data={salesTickitList?.data?.todaySalesHistory || []}
        />
      </TableWrapper>

      {salesTickitState.detailsModalOpen && (
        <CounterOrderDetailsModal
          isOpen={salesTickitState.detailsModalOpen}
          onClose={closeDetailsModal}
          order={salesTickitList?.data?.todaySalesHistory.find(
            (order: any) => order.id === salesTickitState.selectedOrderId
          )}
        />
      )}
      {salesTickitState.updateModalOpeans && (
        <UpdateCounterOrderModal
          isOpen={salesTickitState.updateModalOpeans}
          onClose={closeUpdateModal}
          order={salesTickitList?.data?.todaySalesHistory.find(
            (order: any) => order.id === salesTickitState.selectedOrderId
          )}
        />
      )}
    </PageWrapper>
  );
};

export default CounterDashboardHome;
