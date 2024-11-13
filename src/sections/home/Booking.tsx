import PageTransition from "@/components/common/effect/PageTransition";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import { Heading } from "@/components/common/typography/Heading";
import { Label } from "@/components/common/typography/Label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
interface IBookingProps {
  bookingState: any;
  setBookingState: any;
}

export interface IBookingStateProps {
  calenderOpen: boolean;
  fromCounterId: number | null;
  destinationCounterId: number | null;
  returnCalenderOpen: boolean;
  coachType: string;
  date: Date | null;
  returnDate?: Date | null;
  bookingCoachesList: any[];
  roundTripGobookingCoachesList: any[];
  roundTripReturnBookingCoachesList: any[];
}

const Booking: FC<IBookingProps> = ({ bookingState, setBookingState }) => {
  const { translate } = useCustomTranslator();
  const [tripType, setTripType] = useState("One_Trip");
  // console.log("bookingState@@", bookingState);

  const shouldFetchData = Boolean(
    bookingState.fromCounterId &&
      bookingState.destinationCounterId &&
      bookingState.coachType &&
      bookingState.date &&
      (tripType === "One_Trip" || bookingState.returnDate) &&
      tripType
  );

  const { data: bookingCoachesData, isLoading: coachListLoading } =
    useGetBookingCoachesQuery(
      shouldFetchData
        ? {
            fromCounterId: bookingState?.fromCounterId,
            destinationCounterId: bookingState?.destinationCounterId,
            orderType: tripType,
            coachType: bookingState.coachType,
            date: bookingState.date && format(bookingState.date, "yyyy-MM-dd"),
            returnDate:
              tripType !== "One_Trip" && bookingState.returnDate
                ? format(bookingState.returnDate, "yyyy-MM-dd")
                : undefined, // Only include returnDate if it's a round trip
          }
        : {}, // Provide empty query parameters if conditions aren't met
      { skip: !shouldFetchData } // Skip fetching if required fields are missing
    ) as any;

  // Clear previous data when trip type changes
  useEffect(() => {
    setBookingState((prevState: IBookingStateProps) => ({
      ...prevState,
      bookingCoachesList: [],
      roundTripGobookingCoachesList: [],
      roundTripReturnBookingCoachesList: [],
    }));
  }, [tripType, setBookingState]);

  // Fetch data and populate the appropriate lists based on trip type
  useEffect(() => {
    if (shouldFetchData && bookingCoachesData?.data) {
      if (tripType === "Round_Trip") {
        setBookingState((prevState: IBookingStateProps) => ({
          ...prevState,
          roundTripGobookingCoachesList: bookingCoachesData.data,
          roundTripReturnBookingCoachesList: bookingCoachesData.returnData,
        }));
      } else {
        setBookingState((prevState: IBookingStateProps) => ({
          ...prevState,
          bookingCoachesList: bookingCoachesData.data,
          roundTripGobookingCoachesList: [],
          roundTripReturnBookingCoachesList: [],
        }));
      }
    }
  }, [
    shouldFetchData,
    bookingState.fromCounterId,
    bookingState.destinationCounterId,
    bookingState.coachType,
    bookingState.date,
    bookingState.returnDate,
    bookingCoachesData,
    setBookingState,
    tripType,
  ]);

  //console.log("tripType", tripType);
  console.log("bookingCoachesData:--->>", bookingCoachesData);
  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;
  // if (countersLoading || coachListLoading) {
  //   return <DetailsSkeleton />;
  // }
  return (
    <div className="flex justify-center items-center">
      <PageTransition className=" w-full ">
        <div className="mt-2 mb-24">
          <div id="booking" className="rounded-lg ">
            <Heading className=" text-start  pb-6" size="h4">
              {translate("আপনার যাত্রা শুরু করুন", "Start Your Journey")}
            </Heading>
            {/* COACH FILTERS */}
            <div className="rounded-xl p-7  bg-gradient-to-tr from-primary to-tertiary text-primary-foreground">
              {/* seelct trip type */}
              <PageTransition className="flex py-5 flex-col gap-3 items-center justify-center h-full w-full">
                <RadioGroup
                  className="flex gap-4"
                  value={tripType}
                  onValueChange={setTripType} // Update bookingType state on change
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="One_Trip" id="r2" />
                    <Label htmlFor="r2">One Trip</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Round_Trip" id="r3" />
                    <Label htmlFor="r3">Round Trip</Label>
                  </div>
                </RadioGroup>
              </PageTransition>
              <ul className="grid grid-cols-2 gap-5">
                {/* START   ING POINT */}
                <li>
                  <Select
                    value={bookingState?.fromCounterId?.toString() || ""}
                    onValueChange={(value: string) => {
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        fromCounterId: +value,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={translate(
                          "শুরু করার কাউন্টার",
                          "Staring Counter"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {!countersLoading &&
                        countersData?.data?.length > 0 &&
                        countersData?.data?.map(
                          (singleCounter: any, counterIndex: number) => (
                            <SelectItem
                              key={counterIndex}
                              value={singleCounter?.id?.toString()}
                            >
                              {singleCounter?.name}
                            </SelectItem>
                          )
                        )}

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
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        destinationCounterId: +value,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={translate(
                          "গন্তব্য কাউন্টার",
                          "Ending Counter"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {!countersLoading &&
                        countersData?.data?.length > 0 &&
                        countersData?.data
                          .filter(
                            (target: any) =>
                              target?.id !== bookingState.fromCounterId
                          )
                          ?.map((singleCounter: any, counterIndex: number) => (
                            <SelectItem
                              key={counterIndex}
                              value={singleCounter?.id?.toString()}
                            >
                              {singleCounter?.name}
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
                    onValueChange={(value: "AC" | "NON AC") => {
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        coachType: value,
                      }));
                    }}
                  >
                    <SelectTrigger id="coachType" className="w-full">
                      <SelectValue
                        placeholder={translate("কোচের ধরণ", "Coach Type")}
                      />
                    </SelectTrigger>
                    <SelectContent>
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
                {/*GOING DATE */}
                <li>
                  <Popover
                    open={bookingState.calenderOpen}
                    onOpenChange={(open) =>
                      setBookingState((prevState: IBookingStateProps) => ({
                        ...prevState,
                        calenderOpen: open,
                      }))
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                          !bookingState.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingState.date ? (
                          format(bookingState.date, "PPP")
                        ) : (
                          <span>
                            {translate(
                              "বুকিংয়ের তারিখ নির্বাচন করুন",
                              "Pick The Booking Date"
                            )}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end">
                      <Calendar
                        mode="single"
                        // captionLayout="dropdown-buttons"
                        selected={bookingState?.date || new Date()}
                        onSelect={(date) => {
                          setBookingState((prevState: IBookingStateProps) => ({
                            ...prevState,
                            date: date || new Date(),
                            calenderOpen: false,
                          }));
                        }}
                        fromYear={1960}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </li>

                {/*RETURN DATE */}
                {tripType === "Round_Trip" && (
                  <li>
                    <Popover
                      open={bookingState.returnCalenderOpen}
                      onOpenChange={(open) =>
                        setBookingState((prevState: IBookingStateProps) => ({
                          ...prevState,
                          returnCalenderOpen: open,
                        }))
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                            !bookingState.returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingState.returnDate ? (
                            format(bookingState.returnDate, "PPP")
                          ) : (
                            <span>
                              {translate(
                                "ফেরার তারিখ নির্বাচন করুন",
                                "Pick Return Booking Date"
                              )}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end">
                        <Calendar
                          mode="single"
                          // captionLayout="dropdown-buttons"
                          selected={bookingState?.returnDate || new Date()}
                          onSelect={(date) => {
                            setBookingState(
                              (prevState: IBookingStateProps) => ({
                                ...prevState,
                                returnDate: date || new Date(),
                                returnCalenderOpen: false,
                              })
                            );
                          }}
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </li>
                )}

                <li>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="text-muted-foreground"
                          onClick={() => {
                            setBookingState(
                              (prevState: IBookingStateProps) => ({
                                ...prevState,
                                fromCounterId: null,
                                destinationCounterId: null,
                                schedule: "",
                                coachType: "",
                                date: null,
                                bookingCoachesList: [],
                              })
                            );
                          }}
                          variant="outline"
                          size="icon"
                        >
                          <span className="sr-only">Refresh Button</span>
                          <LuRefreshCw className="size-[21px]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default Booking;
