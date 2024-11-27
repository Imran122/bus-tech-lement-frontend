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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useOrderCancelRequestMutation } from "@/store/api/bookingApi";
import { useGetSalesTickitListQuery } from "@/store/api/counter/counterSalesBookingApi";
import { selectCounterSearchFilter } from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useSelector } from "react-redux";
import CounterOrderDetailsModal from "../sales/CounterOrderDetailsModal";
import UpdateCounterOrderModal from "../sales/UpdateCounterOrderModal";

import DashboardRoundTripTickitBookingCard from "@/components/common/card/DashboardRoundTripTickitBookingCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PiKeyReturnBold } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
import TicketPrintSingle from "../../printLabel/TicketPrintSingle";

interface ISalesListProps {}
export interface ISalesDataStateProps {
  search: string;
  addUserOpen: boolean;
  updateModalOpeans: boolean;
  detailsModalOpen: boolean;
  usersList: Partial<any[]>;
  selectedOrderId: number | null;
  isPrinting: boolean;
}

const CounterDashboardHome: FC<ISalesListProps> = () => {
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  const bookingState = useSelector(selectCounterSearchFilter);

  const [cancelRequst] = useOrderCancelRequestMutation();
  const printSaleRef = useRef(null);

  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);

  const [invoiceData, setInvoiceData] = useState();

  const [salesTickitState, setSalesTickitState] =
    useState<ISalesDataStateProps>({
      search: "",
      addUserOpen: false,
      updateModalOpeans: false,
      detailsModalOpen: false,
      usersList: [],
      selectedOrderId: null,
      isPrinting: false,
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
  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (salesTickitState.isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [salesTickitState.isPrinting]);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setSalesTickitState((prevState) => ({
          ...prevState,
          isPrinting: true,
        }));
      });
    },
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      setSalesTickitState((prevState) => ({ ...prevState, isPrinting: false }));
    },
  });

  const handelCancleRequest = async (orderId: number) => {
    try {
      const result = await cancelRequst(orderId).unwrap();
      if (result?.data?.success) {
        toast({
          title: translate(
            "টিকিট বাতিলের অনুরোধের জন্য বার্তা",
            "Message for cancel ticket request"
          ),
          description: toastMessage(
            "cancel",
            translate("টিকিট বাতিলের অনুরোধ", "Cancel Ticket Request")
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeUpdateModal = () => {
    setSalesTickitState((prev) => ({
      ...prev,
      updateModalOpeans: false,
      selectedOrderId: null,
    }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => (query.page - 1) * query.size + info.row.index + 1,
    },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নং", "Coach No"),
    },
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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color = status === "Success" ? "text-green-700" : "text-red-700";
        return <span className={`${color} font-semibold`}>{status}</span>;
      },
    },
    {
      accessorKey: "amount",
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
      cell: ({ row }) => {
        const order = row.original as any;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onMouseEnter={() => setInvoiceData(order)}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <CounterOrderDetailsModal id={order?.id} />
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => handleUpdateClick(row.original.id)}
                variant="outline"
                size="xs"
                className="w-full flex justify-start"
              >
                {translate("পেমেন্ট করুন", "Pay")}
              </Button>
              <Button
                onClick={() => handlePrint()}
                variant="outline"
                size="xs"
                className="w-full flex justify-start"
              >
                {translate("টিকেট প্রিন্ট করুন", "Print Ticket")}
              </Button>

              {/*  CANCEL ALERT */}
              {order?.status !== "Cancelled" && (
                <AlertDialog>
                  <AlertDialogTrigger
                    className={cn(
                      "w-full flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    <span className="ml-0.5">
                      {translate("টিকিট বাতিল", "Cancel Ticket")}
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {translate(
                          "আপনি কি একদম নিশ্চিত?",
                          "Are you absolutely sure?"
                        )}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {translate(
                          "আপনি টিকিট বাতিল করতে চান? আপনি আপনার টিকিট বাতিল করতে যাচ্ছেন।",
                          "Are you sure you want to cancel this ticked? You are about to calcel your ticket."
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {translate("বাতিল করুন", "Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handelCancleRequest(order?.id)}
                      >
                        {translate("নিশ্চিত করুন", "Confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loadingSalesTickit) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <section>
      <PageWrapper>
        <div className="grid lg:grid-cols-5 grid-cols-2 gap-5 my-5">
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

        {/* roundtrip design work card */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripGobookingCoachesList.length > 0 && (
            <Accordion className="w-full" type="single" collapsible>
              {bookingState?.roundTripGobookingCoachesList.map(
                (singleCoachData: any, coachDataIndex: number) => (
                  <DashboardRoundTripTickitBookingCard
                    key={coachDataIndex}
                    coachData={singleCoachData}
                    index={coachDataIndex}
                  />
                )
              )}
            </Accordion>
          )}
        {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
          <div className="my-10 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-green-500/50 border-dashed bg-primary/5 backdrop-blur-[2px]">
            <h2 className="font-bold text-green-400 text-2xl">
              Select Return Ticket
            </h2>
            <span className="py-3">
              <PiKeyReturnBold size={24} />
            </span>
          </div>
        )}

        {/* roundtrip design work card back */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripReturnBookingCoachesList.length > 0 && (
            <Accordion className="w-full" type="single" collapsible>
              {bookingState?.roundTripReturnBookingCoachesList.map(
                (singleCoachData: any, coachDataIndex: number) => (
                  <DashboardRoundTripTickitBookingCard
                    key={coachDataIndex}
                    coachData={singleCoachData}
                    index={coachDataIndex}
                  />
                )
              )}
            </Accordion>
          )}
        <TableWrapper
          subHeading={translate(
            "আজকের সেলস তথ্য উপাত্ত",
            "Today's Sales Information"
          )}
          heading={translate("আজকের সেলস", "Today's Sales")}
        >
          <TableToolbar alignment="responsive">
            <ul className="flex items-center gap-x-2">
              <li>
                <Input
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSalesTickitState((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="lg:w-[300px] md:w-[250px] w-[200px]"
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
      <div className="invisible hidden -left-full">
        {salesTickitList && (
          <TicketPrintSingle ref={printSaleRef} tickitData={invoiceData} />
        )}
      </div>
    </section>
  );
};

export default CounterDashboardHome;
