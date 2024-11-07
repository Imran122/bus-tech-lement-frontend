/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
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
import {
  AddUpdateCollectionDataProps,
  addUpdateCollectionSchema,
} from "@/schemas/addUpdateCollectionSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import {
  useAddCollectionOfSupervisorMutation,
  useGetTodaysCoachConfigListQuery,
} from "@/store/api/superviosr/supervisorCollectionApi";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface IAddSupervisorCollectionProps {
  setCollectionState: (state: (prevState: any) => any) => void;
}

const AddSupervisorCollection: FC<IAddSupervisorCollectionProps> = ({
  setCollectionState,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const user = useSelector((state: any) => state.user);

  const [addCollectionOfSupervisor, { isLoading, error }] =
    useAddCollectionOfSupervisorMutation();

  const { data: coachConfigs, isLoading: coachConfigLoading } =
    useGetTodaysCoachConfigListQuery({});
  const { data: counters, isLoading: counterLoading } = useGetCountersQuery({
    size: 1000,
    page: 1,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddUpdateCollectionDataProps>({
    resolver: zodResolver(addUpdateCollectionSchema),
  });

  const collectionType = watch("collectionType");

  // Effect to handle changes in collectionType
  useEffect(() => {
    if (collectionType === "OpeningBalance") {
      setValue("noOfPassenger", 0); // Set to 0 for OpeningBalance
    }
  }, [collectionType, setValue]);

  const onDateSelect = (date: Date | null) => {
    if (date) {
      setValue("date", date.toISOString().split("T")[0]); // Format to YYYY-MM-DD
    } else {
      setValue("date", "");
    }
  };

  const onSubmit = async (data: AddUpdateCollectionDataProps) => {
    const cleanedData = {
      ...data,
      supervisorId: user.id,
      date: new Date(data.date),
    };

    const result = await addCollectionOfSupervisor(cleanedData);
    if (result.data?.success) {
      toast({
        title: translate(
          "সংগ্রহ যোগ করা হয়েছে",
          "Collection Added Successfully"
        ),
        description: toastMessage("add", translate("সংগ্রহ", "Collection")),
      });
      playSound("add");

      setCollectionState((prevState: any) => ({
        ...prevState,
        addCollectionOpen: false,
      }));
    }
  };

  if (counterLoading || coachConfigLoading) {
    return <FormSkeleton />;
  }

  return (
    <FormWrapper
      heading={translate("সংগ্রহ যোগ করুন", "Add Collection")}
      subHeading={translate(
        "নতুন সংগ্রহ যোগ করতে নিচের তথ্য পূরণ করুন।",
        "Fill in the details below to add a new collection."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* Coach Config */}
          <InputWrapper
            labelFor="coachConfigId"
            error={errors.coachConfigId?.message}
            label={translate("কোচ কনফিগ", "Coach Config")}
          >
            <Select
              onValueChange={(value) =>
                setValue("coachConfigId", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    "কোচ কনফিগ নির্বাচন করুন",
                    "Select Coach Config"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!coachConfigLoading &&
                  coachConfigs?.data?.map((config: any) => (
                    <SelectItem key={config.id} value={config.id.toString()}>
                      {config.coachNo}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Counter */}
          <InputWrapper
            labelFor="counterId"
            error={errors.counterId?.message}
            label={translate("কাউন্টার", "Counter")}
          >
            <Select
              onValueChange={(value) => setValue("counterId", parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    "কাউন্টার নির্বাচন করুন",
                    "Select Counter"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!counterLoading &&
                  counters?.data?.map((counter: any) => (
                    <SelectItem key={counter.id} value={counter.id.toString()}>
                      {counter.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Collection Type */}
          <InputWrapper
            labelFor="collectionType"
            error={errors.collectionType?.message}
            label={translate("সংগ্রহের ধরন", "Collection Type")}
          >
            <Select
              onValueChange={(value: "OpeningBalance" | "CounterCollection") =>
                setValue("collectionType", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    "সংগ্রহের ধরন নির্বাচন করুন",
                    "Select Collection Type"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CounterCollection">
                  {translate("কাউন্টার সংগ্রহ", "Counter Collection")}
                </SelectItem>
                <SelectItem value="OthersIncome">
                  {translate("অন্যান্য সংগ্রহ", "Others Collection")}
                </SelectItem>
                <SelectItem value="OpeningBalance">
                  {translate("প্রারম্ভিক ব্যালেন্স", "Opening Balance")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Route Direction */}
          <InputWrapper
            labelFor="routeDirection"
            error={errors.routeDirection?.message}
            label={translate("রুটের দিক", "Route Direction")}
          >
            <Select
              onValueChange={(value: "Down_Way" | "Up_Way") =>
                setValue("routeDirection", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    "রুটের দিক নির্বাচন করুন",
                    "Select Route Direction"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Up_Way">
                  {translate("উপায়", "Up Way")}
                </SelectItem>
                <SelectItem value="Down_Way">
                  {translate("ডাউন ওয়ে", "Down Way")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Number of Passengers */}
          <InputWrapper
            labelFor="noOfPassenger"
            error={errors.noOfPassenger?.message}
            label={translate("যাত্রীর সংখ্যা", "Number of Passengers")}
          >
            <Input
              {...register("noOfPassenger", { valueAsNumber: true })}
              type="number"
              disabled={collectionType === "OpeningBalance"} // Disable input if OpeningBalance
              placeholder={
                collectionType === "OpeningBalance"
                  ? ""
                  : translate(
                      "যাত্রীর সংখ্যা লিখুন",
                      "Enter Number of Passengers"
                    )
              }
            />
          </InputWrapper>

          {/* Amount */}
          <InputWrapper
            labelFor="amount"
            error={errors.amount?.message}
            label={translate("পরিমাণ", "Amount")}
          >
            <Input
              {...register("amount", { valueAsNumber: true })}
              type="number"
            />
          </InputWrapper>

          {/* Token */}
          <InputWrapper
            labelFor="token"
            error={errors.token?.message}
            label={translate("টোকেন", "Token")}
          >
            <Input
              {...register("token", { valueAsNumber: true })}
              type="number"
            />
          </InputWrapper>

          {/* Date */}
          <InputWrapper
            labelFor="date"
            error={errors.date?.message}
            label={translate("তারিখ", "Date")}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("date")
                    ? format(new Date(watch("date")), "PPP")
                    : translate("তারিখ নির্বাচন করুন", "Pick a Date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  //@ts-ignore
                  selected={watch("date") ? new Date(watch("date")) : null}
                  onSelect={(date: any) => onDateSelect(date)} // Ensure the date is selected correctly
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </div>

        <Submit
          loading={isLoading}
          errors={error}
          errorTitle="Add Collection failed"
          submitTitle={translate("সংগ্রহ যোগ করুন", "Add Collection")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSupervisorCollection;
