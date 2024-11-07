import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
  AddUpdateFareDataProps,
  addUpdateFareSchema,
} from "@/schemas/vehiclesSchedule/addUpdateFareSchema";
import { useAddFareMutation } from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IFareStateProps } from "./FareList";

interface IAddFareProps {
  setFareState: (
    driverState: (prevState: IFareStateProps) => IFareStateProps
  ) => void;
}

interface IAddFareFromStateProps {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateCalendarOpen: boolean;
  toDateCalendarOpen: boolean;
}

const AddFare: FC<IAddFareProps> = ({ setFareState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [addFareFormState, setAddFareFormState] =
    useState<IAddFareFromStateProps>({
      fromDate: null,
      toDate: null,
      fromDateCalendarOpen: false,
      toDateCalendarOpen: false,
    });

  const {
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddUpdateFareDataProps>({
    resolver: zodResolver(addUpdateFareSchema),
  });

  const [addFare, { isLoading: addFareLoading, error: addFareError }] =
    useAddFareMutation();

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const onSubmit = async (data: AddUpdateFareDataProps) => {
    const update = removeFalsyProperties(data, ["fromDate", "toDate"]);
    const result = await addFare(update);
    if (result?.data?.success) {
      toast({
        title: translate("ভাড়া যোগ করার বার্তা", "Message for adding fare"),
        description: toastMessage("add", translate("ভাড়া", "fare")),
      });

      setFareState((prevState: IFareStateProps) => ({
        ...prevState,
        addFareOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("ভাড়া যোগ করুন", "Add Fare")}
      subHeading={translate(
        "সিস্টেমে নতুন ভাড়া যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new fare to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper columns={2}>
          {/* ROUTE */}
          <InputWrapper
            labelFor="route"
            error={errors?.route?.message}
            label={translate(
              addUpdateFareForm?.route.label.bn,
              addUpdateFareForm.route.label.en
            )}
          >
            <Select
              value={watch("route") || ""}
              onValueChange={(value: string) => {
                setValue("route", value);
                setError("route", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="route" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateFareForm.route.placeholder.bn,
                    addUpdateFareForm.route.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!routesLoading &&
                  routesData?.data?.length > 0 &&
                  routesData?.data?.map(
                    (singleRoute: any, routeIndex: number) => (
                      <SelectItem
                        key={routeIndex}
                        value={singleRoute?.routeName}
                      >
                        {singleRoute?.routeName}
                      </SelectItem>
                    )
                  )}

                {routesLoading && !routesData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* COACH TYPE */}
          <InputWrapper
            labelFor="type"
            error={errors?.type?.message}
            label={translate(
              addUpdateFareForm?.type.label.bn,
              addUpdateFareForm.type.label.en
            )}
          >
            <Select
              value={watch("type") || ""}
              onValueChange={(value: "AC" | "NON AC") => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateFareForm.type.placeholder.bn,
                    addUpdateFareForm.type.placeholder.en
                  )}
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
          </InputWrapper>

          {/* STARTING DATE (FROM DATE) */}
          {/* STARTING DATE (FROM DATE) */}
          <InputWrapper
            error={errors?.fromDate?.message}
            labelFor="fromDate"
            label={translate(
              addUpdateFareForm.fromDate.label.bn,
              addUpdateFareForm.fromDate.label.en
            )}
          >
            <Popover
              open={addFareFormState.fromDateCalendarOpen}
              onOpenChange={(open) =>
                setAddFareFormState((prevState: IAddFareFromStateProps) => ({
                  ...prevState,
                  fromDateCalendarOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addFareFormState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addFareFormState.fromDate ? (
                    format(addFareFormState.fromDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateFareForm.fromDate.placeholder.bn,
                        addUpdateFareForm.fromDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  selected={addFareFormState?.fromDate || new Date()}
                  onSelect={(date) => {
                    setValue("fromDate", date);
                    setError("fromDate", { type: "custom", message: "" });
                    setAddFareFormState(
                      (prevState: IAddFareFromStateProps) => ({
                        ...prevState,
                        fromDate: date || new Date(),
                        fromDateCalendarOpen: false,
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* ENDING DATE (TO DATE) */}

          <InputWrapper
            error={errors?.toDate?.message}
            labelFor="toDate"
            label={translate(
              addUpdateFareForm.toDate.label.bn,
              addUpdateFareForm.toDate.label.en
            )}
          >
            <Popover
              open={addFareFormState.toDateCalendarOpen}
              onOpenChange={(open) =>
                setAddFareFormState((prevState: IAddFareFromStateProps) => ({
                  ...prevState,
                  toDateCalendarOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addFareFormState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addFareFormState.toDate ? (
                    format(addFareFormState.toDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateFareForm.toDate.placeholder.bn,
                        addUpdateFareForm.toDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  selected={addFareFormState?.toDate || new Date()}
                  onSelect={(date) => {
                    setValue("toDate", date);
                    setError("toDate", { type: "custom", message: "" });
                    setAddFareFormState(
                      (prevState: IAddFareFromStateProps) => ({
                        ...prevState,
                        toDate: date || new Date(),
                        toDateCalendarOpen: false,
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
          {/* FARE AMOUNT */}
          <InputWrapper
            error={errors?.amount?.message}
            labelFor="amount"
            label={translate(
              addUpdateFareForm.amount.label.bn,
              addUpdateFareForm.amount.label.en
            )}
          >
            <Input
              placeholder={translate(
                addUpdateFareForm.amount.placeholder.bn,
                addUpdateFareForm.amount.placeholder.en
              )}
              type="number"
              id="amount"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const input = +e.target.value;

                setValue("amount", input);
                if (e.target.value) {
                  setError("amount", {
                    type: "custom",
                    message: "",
                  });
                } else {
                  setError("amount", {
                    type: "custom",

                    message: "Fare amount is required",
                  });
                }
              }}
            />
          </InputWrapper>
        </GridWrapper>

        <Submit
          loading={addFareLoading}
          errors={addFareError}
          submitTitle={translate("ভাড়া যুক্ত করুন", "Add Fare")}
          errorTitle={translate("ভাড়া যোগ করতে ত্রুটি", "Add Fare Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFare;
