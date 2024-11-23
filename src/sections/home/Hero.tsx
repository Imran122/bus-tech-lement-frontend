import HeroTiltCard from "@/components/common/effect/HeroTiltCard";
import PageTransition from "@/components/common/effect/PageTransition";
import { FlipWords } from "@/components/common/typography/FlipWords";
import { Heading } from "@/components/common/typography/Heading";
import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { FC, useState } from "react";
import Booking, { IBookingStateProps } from "./Booking";
import SearchResult from "./SearchResult";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { eachDayOfInterval, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface IHeroProps {}

const Hero: FC<IHeroProps> = () => {
  const { translate } = useCustomTranslator();
  const { locale } = useLocaleContext();
  const [bookingState, setBookingState] = useState<IBookingStateProps>({
    calenderOpen: false,
    fromCounterId: null,
    destinationCounterId: null,
    returnCalenderOpen: false,
    coachType: "AC",
    date: new Date(),
    returnDate: null,
    bookingCoachesList: [],

    roundTripGobookingCoachesList: [],
    roundTripReturnBookingCoachesList: [],
  });
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const generateDateRangeArray = (from: Date, to: Date): string[] => {
    const dates = eachDayOfInterval({ start: from, end: to });
    return dates.map((date) => format(date, "yyyy-MM-dd"));
  };

  const [departureDates, setDepartureDates] = useState<string[]>([]);

  // Update the `onSelect` function to handle the date array
  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);

    if (selectedDate?.from && selectedDate.to) {
      // Generate array of dates for the full range
      const rangeDates = generateDateRangeArray(
        selectedDate.from,
        selectedDate.to
      );
      setDepartureDates(rangeDates);
    } else if (selectedDate?.from) {
      // Single date selected
      setDepartureDates([format(selectedDate.from, "yyyy-MM-dd")]);
    } else {
      setDepartureDates([]);
    }
  };
  return (
    <section>
      {/* Left side: Heading and Booking Form */}
      <div className="w-full px-2 ">
        <Heading
          className={cn(locale !== "bn" && "font-lora font-semibold")}
          size="h2"
        >
          {translate("বিশ্বাসের সাথে", "Travel")}
          <FlipWords
            className="text-primary dark:text-primary font-extrabold tracking-tighter font-lora"
            words={[
              "Safely",
              "Cozily",
              "Quickly",
              "Easily",
              "Happily",
              "Gently",
              "Quietly",
              "Boldly",
              "Freely",
              "Neatly",
              "Calmly",
              "Softly",
              "Bravely",
            ]}
          />
          <br />
          {translate("যাত্রা করুন", "with Confidence")}
        </Heading>
      </div>
      <SectionWrapper className="px-4">
        {/* Container for left and right sides */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-6">
          {/* Booking form */}
          <div className="w-full">
            <Booking
              bookingState={bookingState}
              setBookingState={setBookingState}
            />
          </div>

          {/* Right side: Thumbnail */}
          <div className=" w-full flex justify-center lg:justify-end ">
            <HeroTiltCard className="lg:w-[500px] w-8/12 lg:h-[450px] h-[400px] border-8 border-secondary/10 overflow-visible rounded-3xl">
              <PageTransition>
                <img
                  className="w-[450px]"
                  src="/iconic_car.svg"
                  alt="Iconic Car"
                />
                <h2 className="text-center text-xl font-lora font-extralight">
                  <strong className="font-extrabold text-secondary">
                    Iconic
                  </strong>{" "}
                  Express
                </h2>
              </PageTransition>
            </HeroTiltCard>
          </div>
        </div>

        <InputWrapper label="Select Date Range✼" labelFor="date_range">
            <Popover>
              <PopoverTrigger id="date_range" asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-sm text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="font-normal">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        {/* search result */}
        <div className="w-full py-10">
          <SearchResult
            bookingState={bookingState}
            setBookingState={setBookingState}
          />
        </div>
      </SectionWrapper>
    </section>
  );
};

export default Hero;
