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
  AddUpdateFareDataProps,
  addUpdateFareSchema,
} from "@/schemas/vehiclesSchedule/addUpdateFareSchema";
import {
  useGetSingleFareQuery,
  useUpdateFareMutation,
} from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IFareStateProps } from "./FareList";

interface IUpdateFareProps {
  setFareState: (
    driverState: (prevState: IFareStateProps) => IFareStateProps
  ) => void;
  id: number | undefined;
}

interface IUpdateFareFromStateProps {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateCalendarOpen: boolean;
  toDateCalendarOpen: boolean;
  routeOpen: boolean;
}

const UpdateFare: FC<IUpdateFareProps> = ({ setFareState, id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [updateFareFormState, setUpdateFareFormState] =
    useState<IUpdateFareFromStateProps>({
      fromDate: null,
      toDate: null,
      fromDateCalendarOpen: false,
      toDateCalendarOpen: false,
      routeOpen: false,
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

  const [updateFare, { isLoading: updateFareLoading, error: updateFareError }] =
    useUpdateFareMutation();
  const { data: fareData, isLoading: fareLoading } = useGetSingleFareQuery(id);

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const onSubmit = async (data: AddUpdateFareDataProps) => {
    const update = removeFalsyProperties(data, ["fromDate", "toDate"]);
    const result = await updateFare({ data: update, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "ভাড়া সম্পাদনা করার বার্তা",
          "Message for adding fare"
        ),
        description: toastMessage("update", translate("ভাড়া", "fare")),
      });

      setFareState((prevState: IFareStateProps) => ({
        ...prevState,
        addFareOpen: false,
      }));
    }
  };

  useEffect(() => {
    setValue("amount", fareData?.data?.amount);
    setValue("fromDate", new Date(fareData?.data?.fromDate) || null);
    setValue("toDate", new Date(fareData?.data?.toDate) || null);
    setValue("route", fareData?.data?.route);
    setValue("type", fareData?.data?.type);
    //setValue("seatPlan", fareData?.data?.seatPlan);
    setUpdateFareFormState((prevState: IUpdateFareFromStateProps) => ({
      ...prevState,
      fromDate: fareData?.data?.fromDate || null,
      toDate: fareData?.data?.toDate || null,
    }));
  }, [fareData, setValue]);

  if (fareLoading) {
    return <FormSkeleton columns={2} inputs={6} />;
  }
  return (
    <FormWrapper
      heading={translate("ভাড়া সম্পাদনা করুন", "Update Fare")}
      subHeading={translate(
        "সিস্টেমে ভাড়া সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the existing fare to the system."
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
              open={updateFareFormState.routeOpen}
              onOpenChange={(open) =>
                setUpdateFareFormState(
                  (prevState: IUpdateFareFromStateProps) => ({
                    ...prevState,
                    routeOpen: open,
                  })
                )
              }
              value={watch("route") || ""}
              onValueChange={(value: string) => {
                if (updateFareFormState.routeOpen) {
                  setValue("route", value);
                  setError("route", { type: "custom", message: "" });
                }
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

          <InputWrapper
            error={errors?.fromDate?.message}
            labelFor="fromDate"
            label={translate(
              addUpdateFareForm.fromDate.label.bn,
              addUpdateFareForm.fromDate.label.en
            )}
          >
            <Popover
              open={updateFareFormState.fromDateCalendarOpen}
              onOpenChange={(open) =>
                setUpdateFareFormState(
                  (prevState: IUpdateFareFromStateProps) => ({
                    ...prevState,
                    fromDateCalendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="fromDate" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateFareFormState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateFareFormState.fromDate ? (
                    format(updateFareFormState?.fromDate || new Date(), "PPP")
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
                  captionLayout="dropdown-buttons"
                  selected={updateFareFormState?.fromDate || new Date()}
                  onSelect={(date) => {
                    setValue("fromDate", date);
                    setError("fromDate", { type: "custom", message: "" });
                    setUpdateFareFormState(
                      (prevState: IUpdateFareFromStateProps) => ({
                        ...prevState,
                        fromDate: date || null,
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
              open={updateFareFormState.toDateCalendarOpen}
              onOpenChange={(open) =>
                setUpdateFareFormState(
                  (prevState: IUpdateFareFromStateProps) => ({
                    ...prevState,
                    toDateCalendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="toDate" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateFareFormState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateFareFormState?.toDate ? (
                    format(updateFareFormState?.toDate || new Date(), "PPP")
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
                  captionLayout="dropdown-buttons"
                  selected={updateFareFormState?.toDate || new Date()}
                  onSelect={(date) => {
                    setValue("toDate", date);
                    setError("toDate", { type: "custom", message: "" });
                    setUpdateFareFormState(
                      (prevState: IUpdateFareFromStateProps) => ({
                        ...prevState,
                        toDate: date || null,
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
              defaultValue={watch("amount")}
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
          loading={updateFareLoading}
          errors={updateFareError}
          submitTitle={translate("ভাড়া সম্পাদনা করুন", "Update Fare")}
          errorTitle={translate(
            "ভাড়া সম্পাদনা করতে ত্রুটি",
            "Update Fare Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateFare;
