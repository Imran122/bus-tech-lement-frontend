import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  addUpdateCoachConfigurationSchema,
  IAddUpdateCoachConfigurationDataProps,
} from "@/schemas/vehiclesSchedule/addUpdateCoachConfigurationSchema";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { eachDayOfInterval, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { ICoachConfigurationStateProps } from "./CoachConfigurationList";


const AddCoachConfiguration: FC<IAddCoachConfigurationProps> = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

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

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,

    formState: { errors },
  } = useForm<IAddUpdateCoachConfigurationDataProps>({
    resolver: zodResolver(addUpdateCoachConfigurationSchema),
    defaultValues: {
      coachType: "AC",
    },
  });

 

  return (
    <FormWrapper
      heading={translate("কোচ কনফিগারেইশন যোগ করুন", "Add Coach Configuration")}
      subHeading={translate(
        "সিস্টেমে কোচ কনফিগারেইশন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new coach configuration to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
          {/* DEPARTURE DATE */}
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
              <PopoverContent className="w-auto p-0" align="end">
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
        <Submit
          loading={addCoachConfigurationLoading}
          errors={addCoachConfigurationError}
          submitTitle={translate(
            "কোচ কনফিগারেইশন যুক্ত করুন",
            "Add Coach Configuration"
          )}
          errorTitle={translate(
            "কোচ কনফিগারেইশন যোগ করতে ত্রুটি",
            "Add Coach Configuration Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddCoachConfiguration;
