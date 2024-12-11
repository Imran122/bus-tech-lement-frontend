import PageTransition from "@/components/common/effect/PageTransition";
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
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
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
  roundTripGobookingCoachesList?: any[];
  roundTripReturnBookingCoachesList?: any[];
}

const Booking: FC<IBookingProps> = ({ bookingState, setBookingState }) => {
  const { translate } = useCustomTranslator();
  const [tripType, setTripType] = useState("One_Trip");
  //const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);
  const dropdownFromRef = useRef<HTMLDivElement>(null);
  const dropdownToRef = useRef<HTMLDivElement>(null);

  //const [isOpen, setIsOpen] = useState(false);

  const shouldFetchData = Boolean(
    bookingState.fromCounterId &&
      bookingState.destinationCounterId &&
      bookingState.coachType &&
      bookingState.date &&
      (tripType === "One_Trip" || bookingState.returnDate) &&
      tripType
  );

  const { data: bookingCoachesData } = useGetBookingCoachesQuery(
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

  //

  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;

  useEffect(() => {
    if (tripType === "One_Trip") {
      // Clear round-trip data from localStorage if trip type is "One_Trip"
      localStorage.removeItem("returnDate");
      localStorage.removeItem("tripType");
    } else if (tripType === "Round_Trip" && bookingState.returnDate) {
      // Store round trip data in localStorage if trip type is "Round_Trip"
      localStorage.setItem("tripType", tripType);

      // Format the return date as "YYYY-MM-DD" to avoid timezone issues
      const formattedReturnDate = format(
        new Date(bookingState.returnDate),
        "yyyy-MM-dd"
      );
      const formattedGoingDate = format(
        new Date(bookingState.date),
        "yyyy-MM-dd"
      );
      localStorage.setItem("returnDate", formattedReturnDate);
      localStorage.setItem("goingDate", formattedGoingDate);
    }
  }, [tripType, bookingState.date, bookingState.returnDate]);

  const closeDropdowns = () => {
    setBookingState((prevState: any) => ({
      ...prevState,
      fromCounterDropdownOpen: false,
      destinationCounterDropdownOpen: false,
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownFromRef.current &&
        !dropdownFromRef.current.contains(event.target as Node) &&
        dropdownToRef.current &&
        !dropdownToRef.current.contains(event.target as Node)
      ) {
        closeDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (dropdown: "from" | "to") => {
    setBookingState((prevState: any) => ({
      ...prevState,
      fromCounterDropdownOpen:
        dropdown === "from" ? !prevState.fromCounterDropdownOpen : false,
      destinationCounterDropdownOpen:
        dropdown === "to" ? !prevState.destinationCounterDropdownOpen : false,
    }));
  };

  const handleCounterSelect = (dropdown: "from" | "to", counterId: number) => {
    if (dropdown === "from") {
      setBookingState((prevState: any) => ({
        ...prevState,
        fromCounterId: counterId,
        fromCounterDropdownOpen: false,
      }));
    } else {
      setBookingState((prevState: any) => ({
        ...prevState,
        destinationCounterId: counterId,
        destinationCounterDropdownOpen: false,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center">
      <PageTransition className=" w-full ">
        <div className="">
          <div id="booking" className="rounded-lg ">
            {/* <h2 className="mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#c84cd9] to-[#840495] sm:bg-gradient-to-l text-start text-base lg:text-[40px] font-bold pb-6 text-grad">
              {translate("আপনার যাত্রা শুরু করুন", "Start Your Journey")}
            </h2> */}
            {/* COACH FILTERS */}
            <div className="rounded-xl p-3 lg:p-7  bg-gradient-to-tr from-primary to-tertiary text-primary-foreground">
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
              <ul className="grid grid-cols-2 gap-5 pb-5">
                {/* STARTING POINT */}

                {/* STARTING POINT */}
                <li>
                  <div className="relative" ref={dropdownFromRef}>
                    <div
                      onClick={() => handleDropdownToggle("from")}
                      className="w-full text-black uppercase text-xs px-4 py-2 bg-white border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
                    >
                      {bookingState.fromCounterId
                        ? countersData?.data?.find(
                            (counter: Counter) =>
                              counter.id === bookingState.fromCounterId
                          )?.name || "Select Starting Counter"
                        : "Select Starting Counter"}
                      <span>▼</span>
                    </div>
                    {bookingState.fromCounterDropdownOpen && (
                      <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {countersLoading ? (
                          <li className="px-4 py-2 text-white">Loading...</li>
                        ) : countersData?.data?.length > 0 ? (
                          countersData.data
                            .filter(
                              (counter: Counter) =>
                                counter.id !== bookingState.destinationCounterId
                            )
                            .map((counter: Counter) => (
                              <li
                                key={counter.id}
                                onClick={() =>
                                  handleCounterSelect("from", counter.id)
                                }
                                className="px-4 py-2 text-black focus:bg-accent focus:text-accent-foreground  cursor-pointer"
                              >
                                {counter.name}
                              </li>
                            ))
                        ) : (
                          <li className="px-4 py-2 text-black">No Data</li>
                        )}
                      </ul>
                    )}
                  </div>
                </li>

                {/* Ending Counter Dropdown */}
                <li>
                  <div className="relative" ref={dropdownToRef}>
                    <div
                      onClick={() => handleDropdownToggle("to")}
                      className="w-full uppercase text-black text-xs px-4 py-2 bg-white border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
                    >
                      {bookingState.destinationCounterId
                        ? countersData?.data?.find(
                            (counter: Counter) =>
                              counter.id === bookingState.destinationCounterId
                          )?.name || "Select Destination Counter"
                        : "Select Destination Counter"}
                      <span>▼</span>
                    </div>
                    {bookingState.destinationCounterDropdownOpen && (
                      <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                        {countersLoading ? (
                          <li className="px-4 py-2 text-black">Loading...</li>
                        ) : countersData?.data?.length > 0 ? (
                          countersData.data
                            .filter(
                              (counter: Counter) =>
                                counter.id !== bookingState.fromCounterId
                            )
                            .map((counter: Counter) => (
                              <li
                                key={counter.id}
                                onClick={() =>
                                  handleCounterSelect("to", counter.id)
                                }
                                className="px-4 py-2 text-black focus:bg-accent focus:text-accent-foreground cursor-pointer"
                              >
                                {counter.name}
                              </li>
                            ))
                        ) : (
                          <li className="px-4 py-2 text-black">No Data</li>
                        )}
                      </ul>
                    )}
                  </div>
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
                    <SelectTrigger
                      id="coachType"
                      className="w-full uppercase text-xs lg:text-sm px-2 lg:px-3"
                    >
                      <SelectValue
                        placeholder={translate("কোচের ধরণ", "Coach Type")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC" className="uppercase">
                        {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                      </SelectItem>
                      <SelectItem value="NON AC" className="uppercase">
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
                          "justify-start text-left font-normal w-full px-3 text-muted-foreground hover:bg-background text-sm h-9",
                          !bookingState.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingState.date ? (
                          format(bookingState.date, "dd/MM/yyyy")
                        ) : (
                          <span>
                            {translate("বুকিংয়ের তারিখ", "Booking Date")}
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
                        disabled={(date) => {
                          // Disable dates before today
                          const today = new Date();
                          return (
                            date <
                            new Date(
                              today.getFullYear(),
                              today.getMonth(),
                              today.getDate()
                            )
                          );
                        }}
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
                            "justify-start px-3 text-left font-normal w-full text-muted-foreground hover:bg-background text-sm h-9",
                            !bookingState.returnDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingState.returnDate ? (
                            format(bookingState.returnDate, "dd/MM/yyyy")
                          ) : (
                            <span>
                              {translate("ফেরার তারিখ", "Return Date")}
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
                          disabled={(date) => {
                            // Disable dates before today
                            const today = new Date();
                            return (
                              date <
                              new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate()
                              )
                            );
                          }}
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
