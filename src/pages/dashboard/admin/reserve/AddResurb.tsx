import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { TimePicker } from "@/components/common/form/TimePicker";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
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
  addUpdateResurbSchema,
  ReservationDataProps,
} from "@/schemas/resurb/addUpdateResurbSchema";
import { useAddReserveMutation } from "@/store/api/reserve/reserveApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { addUpdateResurbForm } from "@/utils/constants/form/addUpdateResurbForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IReserveStateProps } from "./ReserveList";
import { cn } from "@/lib/utils";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";

interface IAddReserveProps {
  setReserveState: (
    reserveState: (prevState: IReserveStateProps) => IReserveStateProps
  ) => void;
  reserveState: any;
}

const AddResurb: FC<IAddReserveProps> = ({ setReserveState, reserveState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [fromDateTime, setFromDateTime] = useState<Date | undefined>(
    new Date()
  );
  const [toDateTime, setToDateTime] = useState<Date | undefined>(new Date());
  const [addReserve, { isLoading: addReserveLoading, error: addReserveError }] =
    useAddReserveMutation({}) as any;
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationDataProps>({
    resolver: zodResolver(addUpdateResurbSchema),
  });

  useEffect(() => {
    if (fromDateTime) {
      // Format the time to exclude seconds
      setValue(
        "fromDateTime",
        fromDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setError("fromDateTime", { type: "custom", message: "" });
    } else {
      setError("fromDateTime", { type: "custom", message: "Time is required" });
    }
    if (toDateTime) {
      // Format the time to exclude seconds
      setValue(
        "toDateTime",
        toDateTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setError("toDateTime", { type: "custom", message: "" });
    } else {
      setError("toDateTime", { type: "custom", message: "Time is required" });
    }
  }, [setValue, setError, fromDateTime, toDateTime]);

  const onSubmit = async (data: ReservationDataProps) => {
    const withoutRemarks = {
      ...data,
      amount: data.amount,
      fromDate: reserveState?.fromDate,
      toDate: reserveState?.toDate,
      paidAmount: data?.paidAmount,
      dueAmount: data.amount - data?.paidAmount,
    };
    const updatedData = removeFalsyProperties(withoutRemarks, ["remarks"]);
    console.log("this is updated data", updatedData);
    const result = await addReserve(updatedData);
    if (result?.data?.success) {
      toast({
        title: translate(
          "রিজার্ভ যোগ করার বার্তা",
          "Message for adding reserve"
        ),
        description: toastMessage("add", translate("রিজার্ভ", "Reserve")),
      });
      setReserveState((prevState: IReserveStateProps) => ({
        ...prevState,
        addReserveOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("রিজার্ভ যোগ করুন", "Add Reserve")}
      subHeading={translate(
        "সিস্টেমে নতুন রিজার্ভ যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new reserve to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* Registration NUMBER */}
          <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              addUpdateResurbForm?.registrationNo.label.bn,
              addUpdateResurbForm?.registrationNo.label.en
            )}
          >
            <Select
              value={watch("registrationNo") || ""} // No need to convert to string here
              onValueChange={(value: string) => {
                setValue("registrationNo", value); // Keep as string
                setError("registrationNo", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="registrationNo" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.registrationNo.placeholder.bn,
                    addUpdateResurbForm.registrationNo.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!vehiclesLoading &&
                  vehiclesData?.data?.length > 0 &&
                  vehiclesData.data.map((coach: any, index: number) => (
                    <SelectItem
                      key={index}
                      value={coach.registrationNo?.toString()} // Use registrationNo as the value
                    >
                      {formatter({
                        type: "words",
                        words: coach.registrationNo,
                      })}
                    </SelectItem>
                  ))}

                {vehiclesLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ROUTE */}
          <InputWrapper
            error={errors?.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateResurbForm?.routeId.label.bn,
              addUpdateResurbForm.routeId.label.en
            )}
          >
            <Select
              value={watch("routeId")?.toString()}
              onValueChange={(value: string) => {
                setValue("routeId", +value);
                setError("routeId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.routeId.placeholder.bn,
                    addUpdateResurbForm.routeId.placeholder.en
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
                        value={singleRoute?.id?.toString()}
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

          {/* NUMBER OF SEATS */}
          <InputWrapper
            labelFor="noOfSeat"
            error={errors?.noOfSeat?.message}
            label={translate(
              addUpdateResurbForm.noOfSeat.label.bn,
              addUpdateResurbForm.noOfSeat.label.en
            )}
          >
            <Select
              value={watch("noOfSeat")?.toString() || ""}
              onValueChange={(value) => {
                setValue("noOfSeat", parseInt(value));
                setError("noOfSeat", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.noOfSeat.placeholder.bn,
                    addUpdateResurbForm.noOfSeat.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {/* Options for 28, 30, 41, and 43 */}

                <SelectItem value="28">Ac Business Class (28 seats)</SelectItem>
                <SelectItem value="30">Sleeper Coach (30 Seats)</SelectItem>
                <SelectItem value="41">Ac Economy Class (41 Seats)</SelectItem>
                <SelectItem value="43">Suite Class (43 Seats)</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* PASSANGER NAME */}
          <InputWrapper
            labelFor="passengerName"
            error={errors.passengerName?.message}
            label={translate(
              addUpdateResurbForm?.passengerName.label.bn,
              addUpdateResurbForm.passengerName.label.en
            )}
          >
            <Input
              id="passengerName"
              type="text"
              {...register("passengerName")}
              placeholder={translate(
                addUpdateResurbForm.passengerName.placeholder.bn,
                addUpdateResurbForm.passengerName.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            error={errors?.contactNo?.message}
            labelFor="contact_number"
            label={translate(
              addUpdateResurbForm?.contactNo.label.bn,
              addUpdateResurbForm.contactNo.label.en
            )}
          >
            <Input
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateResurbForm.contactNo.placeholder.bn,
                addUpdateResurbForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* Address Field */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm.address.label.bn,
              addUpdateResurbForm.address.label.en
            )}
            labelFor="address"
            error={errors.address?.message}
          >
            <Input
              {...register("address")}
              placeholder={translate(
                addUpdateResurbForm.address.placeholder.bn,
                addUpdateResurbForm.address.placeholder.en
              )}
            />
          </InputWrapper>

          {/* Amount */}
          <InputWrapper
            error={errors?.amount?.message}
            label={translate(
              addUpdateResurbForm.amount.label.bn,
              addUpdateResurbForm.amount.label.en
            )}
            labelFor="amount"
          >
            <Input
              id="amount"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("amount", inputValue);
                if (inputValue) {
                  setError("amount", { type: "custom", message: "" });
                } else {
                  setError("amount", {
                    type: "custom",
                    message: "Amount is required",
                  });
                }
              }}
              placeholder={translate(
                addUpdateResurbForm.amount.placeholder.bn,
                addUpdateResurbForm.amount.placeholder.en
              )}
            />
          </InputWrapper>

          {/* Paid Amount */}
          <InputWrapper
            error={errors?.paidAmount?.message}
            label={translate(
              addUpdateResurbForm.paidAmount.label.bn,
              addUpdateResurbForm.paidAmount.label.en
            )}
            labelFor="paidAmount"
          >
            <Input
              id="paidAmount"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("paidAmount", inputValue);
                if (inputValue) {
                  setError("paidAmount", { type: "custom", message: "" });
                } else {
                  setError("paidAmount", {
                    type: "custom",
                    message: "Paid amount is required",
                  });
                }
              }}
              placeholder={translate(
                addUpdateResurbForm.paidAmount.placeholder.bn,
                addUpdateResurbForm.paidAmount.placeholder.en
              )}
            />
          </InputWrapper>

          {/* REMARKS */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm.remarks.label.bn,
              addUpdateResurbForm.remarks.label.en
            )}
            labelFor="remarks"
            error={errors.remarks?.message}
          >
            <Input
              {...register("remarks")}
              placeholder={translate(
                addUpdateResurbForm.remarks.placeholder.bn,
                addUpdateResurbForm.remarks.placeholder.en
              )}
            />
          </InputWrapper>

          {/* FROM DATE */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm?.fromDate.label.bn,
              addUpdateResurbForm.fromDate.label.en
            )}
          >
            <Popover
              open={reserveState.calenderFromOpen}
              onOpenChange={(open) =>
                setReserveState((prevState: IReserveStateProps) => ({
                  ...prevState,
                  calenderFromOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                    !reserveState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reserveState.fromDate ? (
                    format(reserveState.fromDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        "রিজার্ভ তারিখ নির্বাচন করুন",
                        "Pick The Reserve From Date"
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  selected={reserveState?.fromDate || new Date()}
                  onSelect={(date) => {
                    const formattedDate = date ? date.toISOString() : "";
                    setValue("fromDate", formattedDate);
                    setError("fromDate", { type: "custom", message: "" });
                    setReserveState((prevState: IReserveStateProps) => ({
                      ...prevState,
                      calenderFromOpen: false,
                      fromDate: date || null,
                    }));
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* TO DATE */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm?.toDate.label.bn,
              addUpdateResurbForm.toDate.label.en
            )}
          >
            <Popover
              open={reserveState.calenderToOpen}
              onOpenChange={(open) =>
                setReserveState((prevState: IReserveStateProps) => ({
                  ...prevState,
                  calenderToOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                    !reserveState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reserveState.toDate ? (
                    format(reserveState.toDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        "রিজার্ভ তারিখ নির্বাচন করুন",
                        "Pick The Reserve To Date"
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  // captionLayout="dropdown-buttons"
                  selected={reserveState?.toDate || new Date()}
                  onSelect={(date) => {
                    const formattedDate = date ? date.toISOString() : "";
                    setValue("toDate", formattedDate);
                    setError("toDate", { type: "custom", message: "" });
                    setReserveState((prevState: IReserveStateProps) => ({
                      ...prevState,
                      calenderToOpen: false,
                      toDate: date || null,
                    }));
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/*  FROM DATE TIME */}
          <InputWrapper
            error={errors?.fromDateTime?.message}
            labelFor="time"
            label={translate(
              addUpdateResurbForm?.fromDateTime.label.bn,
              addUpdateResurbForm.fromDateTime.label.en
            )}
          >
            <TimePicker
              date={fromDateTime}
              setDate={(date) => {
                setFromDateTime(date); // Update local state

                // Convert date to ISO string if defined, otherwise set to an empty string
                setValue("fromDateTime", date ? date.toISOString() : "");
              }}
            />
            <div className="mt-3">
              {translate("নির্বাচিত সময়সূচীঃ ", " Selected Time: ")}
              {
                // @ts-ignore
                fromDateTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            </div>
          </InputWrapper>

          {/*  TO DATE TIME */}
          <InputWrapper
            error={errors?.toDateTime?.message}
            labelFor="time"
            label={translate(
              addUpdateResurbForm?.toDateTime.label.bn,
              addUpdateResurbForm.toDateTime.label.en
            )}
          >
            <TimePicker
              date={toDateTime}
              setDate={(date) => {
                setToDateTime(date); 
                setValue("toDateTime", date ? date.toISOString() : "");
              }}
            />
            <div className="mt-3">
              {translate("নির্বাচিত সময়সূচীঃ ", " Selected Time: ")}
              {
                // @ts-ignore
                toDateTime?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            </div>
          </InputWrapper>
        </div>
        <Submit
          loading={addReserveLoading}
          errors={addReserveError}
          submitTitle={translate("রিজার্ভ যোগ করুন", "Add Reserve")}
          errorTitle={translate("রিজার্ভ যোগ করতে ত্রুটি", "Add Reserve Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddResurb;
