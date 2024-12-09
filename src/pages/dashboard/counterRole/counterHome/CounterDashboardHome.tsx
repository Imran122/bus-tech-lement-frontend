import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
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

import { cn } from "@/lib/utils";
import {
  useOrderCancelRequestMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import { useGetSalesTickitListQuery } from "@/store/api/counter/counterSalesBookingApi";
import { selectCounterSearchFilter } from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { LuDownload, LuRefreshCw } from "react-icons/lu";
import { useSelector } from "react-redux";
import CounterOrderDetailsModal from "../sales/CounterOrderDetailsModal";
import UpdateCounterOrderModal from "../sales/UpdateCounterOrderModal";

import DashboardRoundTripTickitTable from "@/components/common/table/DashboardRoundTripTickitTable";
import DashboardTickitBookingTable from "@/components/common/table/DashboardTickitBookingTable";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiKeyReturnBold } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import TicketPrintSingle from "../../printLabel/TicketPrintSingle";
import { ICounterBookingFormStateProps } from "../tickit/CounterTickitBookingForm";
import RoundTripFormModal from "./RoundTripFormModal";
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
  //const dispatch = useDispatch();
  //const { toastMessage } = useMessageGenerator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state

  const bookingState = useSelector(selectCounterSearchFilter);
  const [removeBookingSeat] = useRemoveBookingSeatMutation({}) as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCoachSingle, setBookingCoachSingle] = useState({});
  const [goViaRoute, setGoViaRoute] = useState([]);
  const [returnViaRoute, setReturnViaRoute] = useState([]);
  const [cancelRequst] = useOrderCancelRequestMutation();
  const printSaleRef = useRef(null);
  //const [popoverOpen, setPopoverOpen] = useState(false);
  const [bookingFormState, setBookingFormState] =
    useState<ICounterBookingFormStateProps>({
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
      selectedSeats: [],
    });
  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);
  //const dispatch = useDispatch();

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
        toast(translate("টিকিট বাতিলের অনুরোধ", "Cancel Ticket Request"));
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
  //round trip related code

  const handleProceedClick = () => {
    const hasGoingSeat = bookingFormState.selectedSeats.some((seat) =>
      bookingState.roundTripGobookingCoachesList.some(
        (coach: any) => coach.id === seat.coachConfigId
      )
    );

    const hasReturnSeat = bookingFormState.selectedSeats.some((seat) =>
      bookingState.roundTripReturnBookingCoachesList.some(
        (coach: any) => coach.id === seat.coachConfigId
      )
    );

    if (!hasGoingSeat) {
      toast.error(
        translate(
          "Please select at least one seat for the outgoing trip.",
          "যাত্রার জন্য অন্তত একটি আসন নির্বাচন করুন।"
        )
      );
      return;
    }

    if (!hasReturnSeat) {
      toast.error(
        translate(
          "Please select at least one seat for the return trip.",
          "ফেরার জন্য অন্তত একটি আসন নির্বাচন করুন।"
        )
      );
      return;
    }

    // Proceed to open the modal if both conditions are satisfied
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  //reset button
  const ResetDataOfForm = async () => {
    try {
      if (!bookingFormState.selectedSeats.length) {
        toast.warning(
          translate(
            "No seats selected to reset.",
            "রিসেট করার জন্য কোনো আসন নির্বাচন করা হয়নি।"
          )
        );
        return;
      }

      // Iterate over selected seats and call `removeBookingSeat` for each
      const promises = bookingFormState.selectedSeats.map((seat) =>
        removeBookingSeat({
          coachConfigId: seat?.coachConfigId,
          date: seat?.date,
          schedule: seat?.schedule,
          seat: seat.seat,
        })
      );

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      // Check if all API calls were successful
      const allSuccessful = results.every((result) => result?.data?.success);

      if (allSuccessful) {
        toast.success(
          translate(
            "All seats reset successfully.",
            "সব আসন সফলভাবে রিসেট হয়েছে।"
          )
        );

        // Reset the form state
        setBookingFormState({
          targetedSeat: null,
          selectedSeats: [],
          redirectLink: null,
          customerName: null,
          redirectConfirm: false,
        });
      } else {
        toast.error(
          translate(
            "Some seats could not be reset. Please try again.",
            "কিছু আসন রিসেট করা যায়নি। আবার চেষ্টা করুন।"
          )
        );
      }
    } catch (error) {
      console.error("Error resetting seats:", error);
      toast.error(
        translate(
          "Error resetting the seats. Please try again.",
          "আসন রিসেট করার সময় ত্রুটি হয়েছে। আবার চেষ্টা করুন।"
        )
      );
    }
  };
  if (loadingSalesTickit) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <section className=" ">
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
        {/* search result design  */}
        {bookingState.orderType !== "Round_Trip" && (
          <div>
            <DashboardTickitBookingTable
              coachData={bookingState?.bookingCoachesList}
            />
          </div>
        )}
        {bookingState.roundTripGobookingCoachesList?.length > 0 && (
          <div className="my-3 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-[#b642c5]/50 border-dashed bg-[#b642c5] backdrop-blur-[2px]">
            <h2 className="font-bold text-white text-2xl">
              {translate(
                "আপনার যাত্রা শুরুর টিকিট নির্বাচন করুন",
                "Select Your Start Journey Ticket"
              )}
            </h2>
            <span className="py-3 text-white">
              <PiKeyReturnBold size={24} />
            </span>
          </div>
        )}
        {/* roundtrip design work card */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripGobookingCoachesList.length > 0 && (
            <DashboardRoundTripTickitTable
              data={bookingState?.roundTripGobookingCoachesList}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              setGoViaRoute={setGoViaRoute}
              setReturnViaRoute={setReturnViaRoute}
              setBookingCoachSingle={setBookingCoachSingle}
            />
          )}
        {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
          <div className="my-3 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-[#b642c5]/50 border-dashed bg-[#b642c5] backdrop-blur-[2px]">
            <h2 className="font-bold text-white text-2xl">
              {translate(
                "আপনার রিটার্ন জার্নি টিকিট নির্বাচন করুন",
                " Select Your Return Journey Ticket"
              )}
            </h2>
            <span className="py-3 text-white">
              <PiKeyReturnBold size={24} />
            </span>
          </div>
        )}

        {/* roundtrip design work card back */}
        {bookingState.orderType === "Round_Trip" &&
          bookingState.roundTripReturnBookingCoachesList.length > 0 && (
            <DashboardRoundTripTickitTable
              data={bookingState?.roundTripReturnBookingCoachesList}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              setGoViaRoute={setGoViaRoute}
              setReturnViaRoute={setReturnViaRoute}
              setBookingCoachSingle={setBookingCoachSingle}
            />
          )}

        {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
          <div className="w-full mt-5 flex justify-between items-center">
            <button
              onClick={handleProceedClick}
              className="block px-10 py-3 text-xl font-semibold bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Proceed
            </button>
            <div className="lg:py-3 py-3 flex gap-4  px-10 rounded-md justify-center items-center bg-primary">
              <h2 className="text-white text-xl  font-semibold">Reset</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-muted-foreground"
                      onClick={ResetDataOfForm}
                    >
                      <span className="sr-only">Refresh Button</span>
                      <LuRefreshCw className="size-[21px] text-white" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
        {/* table design */}
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

      {/* Modal for round trip form */}
      {isModalOpen && (
        <div className="fixed bottom-0 left-0 top-0 right-0 flex justify-center items-center  bg-black bg-opacity-50 z-50 ">
          <div className="h-[700px] overflow-scroll  w-full max-w-[95%] md:max-w-4xl bg-background border border-primary/50 border-dashed rounded-lg p-5 backdrop-blur-[2px]">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-red-500 font-bold"
            >
              Close
            </button>
            <RoundTripFormModal
              bookingCoach={bookingCoachSingle}
              onClose={handleCloseModal}
              goViaRoute={goViaRoute}
              returnViaRoute={returnViaRoute}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              sharedFormState={sharedFormState}
              setSharedFormState={setSharedFormState}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CounterDashboardHome;
