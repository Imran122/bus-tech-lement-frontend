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
} from "@/store/api/counter/counterSearchFilterSlice";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react"; // Added useState here
import { LuRefreshCw } from "react-icons/lu";
import { useDispatch } from "react-redux";

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
  const [popoverOpen, setPopoverOpen] = useState(false); // Local state to control popover

  // Fetch booking coaches
  const { data: bookingCoachesData } = useGetBookingCoachesQuery({
    fromCounterId: bookingState.fromCounterId,
    destinationCounterId: bookingState.destinationCounterId,
    coachType: bookingState.coachType,
    date: bookingState.date && format(bookingState.date, "yyyy-MM-dd"),
    orderType: "One_Trip",
  }) as any;

  useEffect(() => {
    if (
      bookingState.fromCounterId &&
      bookingState.destinationCounterId &&
      bookingState.date &&
      bookingState.coachType
    ) {
      dispatch(setBookingCoachesList(bookingCoachesData?.data || [])); // Update Redux
    } else {
      dispatch(setBookingCoachesList([])); // Reset to empty if criteria are missing
    }
  }, [
    bookingState.fromCounterId,
    bookingState.destinationCounterId,
    bookingState.date,
    bookingState.coachType,
    bookingCoachesData?.data,
  ]);

  // Fetch counters data
  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;

  return (
    <div className="flex pb-2 justify-center items-center text-white">
      <div className="w-full">
        <div className="mb-6">
          <div className="rounded-xl">
            <ul className="flex gap-5 flex-wrap items-center justify-start">
              {/* STARTING POINT */}
              <li>
                <Select
                  value={bookingState?.fromCounterId?.toString() || ""}
                  onValueChange={(value: string) => {
                    dispatch(setFromCounterId(+value));
                    setBookingState(
                      (prevState: IDashboardBookingStateProps) => ({
                        ...prevState,
                        fromCounterId: +value,
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
                        ? format(new Date(bookingState.date), "PPP")
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
                    />
                  </PopoverContent>
                </Popover>
              </li>

              {/* REFRESH BUTTON */}
              <li>
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
    </div>
  );
};

export default TickitSearchDashboard;
