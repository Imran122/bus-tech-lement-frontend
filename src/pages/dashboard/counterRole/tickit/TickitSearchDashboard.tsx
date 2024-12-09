import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useGetBookingCoachesQuery } from "@/store/api/bookingApi";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import {
  setBookingCoachesList,
  setCoachType,
  setDate,
  setDestinationCounterId,
  setFromCounterId,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
} from "@/store/api/counter/counterSearchFilterSlice";
import { closeModal, openModal } from "@/store/api/user/coachConfigModalSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react"; // Added useState here
import { LuRefreshCw } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import DashboardRountTripSearchModal from "./DashboardRountTripSearchModal";

interface IDashboardBookingProps {
  bookingState: any;
  setBookingState: any;
}

export interface IDashboardBookingStateProps {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  coachType: string;
  date: Date | null;
  bookingCoachesList: any[];
}

const TickitSearchDashboard: FC<IDashboardBookingProps> = ({
  bookingState,
  setBookingState,
}) => {
  const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isModalOpen = useSelector(
    (state: any) => state.coachConfigModal.isModalOpen
  );
  const user = useSelector((state: any) => state.user);

  // Fetch booking coaches
  const { data: bookingCoachesData } = useGetBookingCoachesQuery({
    fromCounterId: bookingState.fromCounterId,
    destinationCounterId: bookingState.destinationCounterId,
    coachType: bookingState.coachType,
    date: bookingState.date
      ? format(new Date(bookingState.date), "yyyy-MM-dd")
      : undefined,
    returnDate: bookingState.returnDate
      ? format(new Date(bookingState.returnDate), "yyyy-MM-dd")
      : undefined,
    orderType: bookingState.orderType,
  }) as any;

  useEffect(() => {
    if (bookingState.orderType === "One_Trip") {
      if (
        bookingState.fromCounterId &&
        bookingState.destinationCounterId &&
        bookingState.date &&
        bookingState.coachType
      ) {
        dispatch(setBookingCoachesList(bookingCoachesData?.data || []));
      } else {
        dispatch(setBookingCoachesList([]));
      }
    } else if (bookingState.orderType === "Round_Trip") {
      if (
        bookingState.fromCounterId &&
        bookingState.destinationCounterId &&
        bookingState.date &&
        bookingState.returnDate &&
        bookingState.coachType
      ) {
        dispatch(
          setRoundTripGoBookingCoachesList(bookingCoachesData?.data || [])
        );
        dispatch(
          setRoundTripReturnBookingCoachesList(
            bookingCoachesData?.returnData || []
          )
        );
      } else {
        dispatch(setRoundTripGoBookingCoachesList([]));
        dispatch(setRoundTripReturnBookingCoachesList([]));
      }
    }
  }, [
    bookingState.fromCounterId,
    bookingState.destinationCounterId,
    bookingState.date,
    bookingState.returnDate,
    bookingState.coachType,
    bookingState.orderType,
    bookingCoachesData,
    dispatch,
  ]);
  // Fetch counters data
  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;
  useEffect(() => {
    if (!bookingState?.fromCounterId && user?.counterId) {
      dispatch(setFromCounterId(user.counterId));
      setBookingState((prevState: IDashboardBookingStateProps) => ({
        ...prevState,
        fromCounterId: user.counterId,
      }));
    }
  }, [bookingState?.fromCounterId, user?.counterId, dispatch]);
  return (
    <div className="flex pb-2 justify-start items-center ">
      <div className="w-auto">
        <div className="">
          <div className="rounded-xl ">
            <ul className="grid lg:grid-cols-6  lg:gap-4 gap-2 justify-start">
              <li>
                <Button onClick={() => dispatch(openModal())} className="">
                  Round Trip
                </Button>
              </li>
              {/* STARTING POINT */}
              {/* STARTING POINT */}
              <li>
                <Select
                  value={
                    bookingState?.fromCounterId
                      ? bookingState.fromCounterId.toString() // Use selected counter
                      : user?.counterId
                      ? user.counterId.toString() // Default to user.counterId
                      : ""
                  }
                  onValueChange={(value: string) => {
                    const selectedCounterId = +value;
                    dispatch(setFromCounterId(selectedCounterId)); // Update Redux state
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        fromCounterId: selectedCounterId, // Update local state
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={translate(
                        "শুরু করার কাউন্টার",
                        "Starting Counter"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!countersLoading &&
                      countersData?.data?.map((counter: any) => (
                        <SelectItem
                          key={counter.id}
                          value={counter.id.toString()}
                        >
                          {counter.name}
                        </SelectItem>
                      ))}
                    {countersLoading && !countersData?.data?.length && (
                      <SelectSkeleton />
                    )}
                  </SelectContent>
                </Select>
              </li>

              {/* ENDING POINT */}
              <li>
                <Select
                  value={bookingState?.destinationCounterId?.toString() || ""}
                  onValueChange={(value: string) => {
                    dispatch(setDestinationCounterId(+value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        destinationCounterId: +value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={translate(
                        "গন্তব্য কাউন্টার",
                        "Ending Counter"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {!countersLoading &&
                      countersData?.data
                        .filter(
                          (target: any) =>
                            target?.id !== bookingState.fromCounterId
                        )
                        ?.map((counter: any) => (
                          <SelectItem
                            key={counter.id}
                            value={counter.id.toString()}
                          >
                            {counter.name}
                          </SelectItem>
                        ))}
                    {countersLoading && !countersData?.data?.length && (
                      <SelectSkeleton />
                    )}
                  </SelectContent>
                </Select>
              </li>

              {/* COACH TYPE */}
              <li>
                <Select
                  value={bookingState.coachType || ""}
                  onValueChange={(value: string) => {
                    dispatch(setCoachType(value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        coachType: value,
                      })
                    );
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={translate("কোচের ধরণ", "Coach Type")}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="AC">
                      {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                    </SelectItem>
                    <SelectItem value="NON AC">
                      {translate(
                        "শীতাতপ নিয়ন্ত্রিত বিহীন",
                        "Without Air Condition"
                      )}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </li>

              {/* DATE */}
              <li>
                <Popover
                  open={popoverOpen}
                  onOpenChange={(open) => setPopoverOpen(open)}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setPopoverOpen(true)}
                      className={cn(
                        "bg-background justify-start text-left font-normal text-sm h-9",
                        !bookingState.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingState.date
                        ? format(bookingState.date, "dd/MM/yyyy")
                        : translate(
                            "বুকিংয়ের তারিখ নির্বাচন করুন",
                            "Pick The Booking Date"
                          )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="bg-background">
                    <Calendar
                      mode="single"
                      selected={
                        bookingState.date
                          ? new Date(bookingState.date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const dateString = date.toISOString(); // Convert to string if dispatching
                          dispatch(setDate(dateString)); // Dispatch to Redux as string
                          setBookingState(
                            (prevState: IDashboardBookingStateProps) => ({
                              ...prevState,
                              date, // Or dateString if setting as string in local state
                            })
                          );
                          setPopoverOpen(false);
                        }
                      }}
                      fromYear={1960}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown-buttons"
                    />
                  </PopoverContent>
                </Popover>
              </li>
              {/* seelct trip type */}

              {/* REFRESH BUTTON */}
              <li className="lg:ml-5 md:ml-12">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="text-muted-foreground bg-background"
                        onClick={() => {
                          dispatch(setFromCounterId(null));
                          dispatch(setDestinationCounterId(null));
                          dispatch(setCoachType(""));
                          dispatch(setDate(null));
                          setBookingState({
                            calenderOpen: false,
                            fromCounterId: null,
                            destinationCounterId: null,
                            coachType: "",
                            date: null,
                            bookingCoachesList: [],
                          });
                        }}
                        variant="outline"
                        size="icon"
                      >
                        <LuRefreshCw className="size-[21px]" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 lg:top-[400px] md:top-[270px] top-[360px]">
          <div className="relative w-full max-w-5xl px-10 py-6 mx-auto bg-background rounded-lg shadow-lg">
            {/* Close Button */}
            <button
              className="absolute top-6 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => dispatch(closeModal())}
              aria-label="Close Modal"
            >
              <MdClose />
            </button>
            <DashboardRountTripSearchModal
              countersData={countersData?.data || []}
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TickitSearchDashboard;
