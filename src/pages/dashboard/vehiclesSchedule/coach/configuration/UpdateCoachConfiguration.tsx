/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetDriversQuery } from "@/store/api/contact/driverApi";
import { useGetUsersQuery } from "@/store/api/contact/userApi";
import { useGetCoachesQuery } from "@/store/api/vehiclesSchedule/coachApi";
import {
  useGetSingleCoachConfigurationQuery,
  useUpdateCoachConfigurationMutation,
} from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useGetFaresQuery } from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateCoachConfigurationProps {
  id: number | null;
}

interface IUpdateCoachConfigurationFormStateProps {
  date: Date | null;
  calendarOpen: boolean;
  supervisorOpen: boolean;
  driverOpen: boolean;
  routeOpen: boolean;
  startingCounterOpen: boolean;
  endingCounterOpen: boolean;
  fareOpen: boolean;
  scheduleOpen: boolean;
}

const UpdateCoachConfiguration: FC<IUpdateCoachConfigurationProps> = ({
  id,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const coachClasses = [
    { value: "E_Class", bn: "ইকোনমি ক্লাস", en: "Economy Class" },
    { value: "B_Class", bn: "বিজনেস ক্লাস", en: "Business Class" },
    { value: "S_Class", bn: "সুইট ক্লাস", en: "Suite Class" },
    { value: "Sleeper", bn: "স্লিপার ক্লাস", en: "Sleeper Class" },
  ];

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,

    formState: { errors },
  } = useForm<IAddUpdateCoachConfigurationDataProps>({
    resolver: zodResolver(addUpdateCoachConfigurationSchema),
  });

  console.log(errors);

  const [
    updateCoachConfigurationFormState,
    setUpdateCoachConfigurationFormState,
  ] = useState<IUpdateCoachConfigurationFormStateProps>({
    date: null,
    calendarOpen: false,
    supervisorOpen: false,
    driverOpen: false,
    routeOpen: false,
    startingCounterOpen: false,
    endingCounterOpen: false,
    fareOpen: false,
    scheduleOpen: false,
  });

  const [
    updateCoachConfiguration,
    {
      isLoading: updateCoachConfigurationLoading,
      error: updateCoachConfigurationError,
    },
  ] = useUpdateCoachConfigurationMutation();

  const { data: coachConfigurationData, isLoading: coachConfigurationLoading } =
    useGetSingleCoachConfigurationQuery(id);

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({}) as any;

  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;
  const { data: driverData, isLoading: driverDataLoading } = useGetDriversQuery(
    {}
  ) as any;
  const { data: coachListData, isLoading: coachListDataLoading } =
    useGetCoachesQuery({}) as any;

  const { data: faresData, isLoading: faresLoading } = useGetFaresQuery(
    {}
  ) as any;

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: supervisorsData, isLoading: supervisorsLoading } =
    useGetUsersQuery({}) as any;

  console.log("coachListData", coachListData);

  useEffect(() => {
    setValue("coachNo", coachConfigurationData?.data?.coachNo);
    setValue("coachType", coachConfigurationData?.data?.coachType);
    setValue("coachClass", coachConfigurationData?.data?.coachClass);
    setValue(
      "destinationCounterId",
      coachConfigurationData?.data?.destinationCounterId
    );

    setValue("fromCounterId", coachConfigurationData?.data?.fromCounterId);

    setValue("registrationNo", coachConfigurationData?.data?.registrationNo);
    setValue("discount", parseInt(coachConfigurationData?.data?.discount));
    setValue("routeId", coachConfigurationData?.data?.routeId);
    setValue("active", coachConfigurationData?.data?.active);
    setValue("schedule", coachConfigurationData?.data?.schedule);
    setValue("tokenAvailable", coachConfigurationData?.data?.tokenAvailable);
    setValue("fareId", coachConfigurationData?.data?.fareId);
    // setValue("seats", coachConfigurationData?.data?.seats);
    setValue("driverId", coachConfigurationData?.data?.driverId);
    setValue("supervisorId", coachConfigurationData?.data?.supervisorId);

    setValue("departureDate", coachConfigurationData?.data?.departureDate);
    setUpdateCoachConfigurationFormState(
      (prevState: IUpdateCoachConfigurationFormStateProps) => ({
        ...prevState,
        date: coachConfigurationData?.data?.departureDate,
      })
    );
  }, [coachConfigurationData, setValue, setError]);

  const onSubmit = async (data: IAddUpdateCoachConfigurationDataProps) => {
    // const seatQuantity = seatPlanOptions.find(
    //   (singlePlan: ISeatPlanOptionsProps) =>
    //     singlePlan.key === watch("seatPlan")
    // )?.value;
    // if (tags?.length !== seatQuantity) {
    //   return setError("seats", {
    //     type: "custom",
    //     message: "Total seat quantity should be exactly " + seatQuantity,
    //   });
    // }
    const updateData = removeFalsyProperties(data, [
      "discount",
      "holdingTime",
      "holdingTime",
    ]);

    const result = await updateCoachConfiguration({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ কনফিগারেইশন সম্পাদন করার বার্তা",
          "Message for updating coach configuration"
        ),
        description: toastMessage(
          "update",
          translate("কোচ কনফিগারেইশন", "coach configuration")
        ),
      });
    }
  };
  console.log("Current coachConfigurationData:", coachConfigurationData);
  if (coachConfigurationLoading || schedulesLoading || coachListDataLoading) {
    return <FormSkeleton columns={3} inputs={16} />;
  }

  return (
    <FormWrapper
      heading={translate(
        "কোচ কনফিগারেইশন সম্পাদন করুন",
        "Update Coach Configuration"
      )}
      subHeading={translate(
        "সিস্টেমে কোচ কনফিগারেইশন সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing coach configuration to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* COACH NUMBER */}

          <InputWrapper
            error={errors?.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachConfigurationForm?.coachNo.label.bn,
              addUpdateCoachConfigurationForm.coachNo.label.en
            )}
          >
            <Select
              value={watch("coachNo")?.toString()}
              onValueChange={(value: string) => {
                setValue("coachNo", value); // Keep as string
                setError("coachNo", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachNo" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.coachNo.placeholder.bn,
                    addUpdateCoachConfigurationForm.coachNo.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!coachListDataLoading &&
                  coachListData?.data?.length > 0 &&
                  coachListData.data.map((coach: any, index: number) => (
                    <SelectItem
                      key={index}
                      value={coach.coachNo?.toString()} // Use registrationNo as the value
                    >
                      {formatter({
                        type: "words",
                        words: coach.coachNo,
                      })}
                    </SelectItem>
                  ))}

                {coachListDataLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* Registration NUMBER */}
          <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              addUpdateCoachConfigurationForm?.registrationNo.label.bn,
              addUpdateCoachConfigurationForm?.registrationNo.label.en
            )}
          >
            <Input
              value={watch("registrationNo") || ""}
              id="registrationNo"
              {...register("registrationNo")}
              type="text"
              //@ts-ignore
              disabled={true}
              placeholder={translate(
                addUpdateCoachConfigurationForm.registrationNo.placeholder.bn,
                addUpdateCoachConfigurationForm.registrationNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* ROUTE */}
          <InputWrapper
            error={errors?.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateCoachConfigurationForm?.routeId.label.bn,
              addUpdateCoachConfigurationForm.routeId.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.routeOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    routeOpen: open,
                  })
                )
              }
              value={watch("routeId")?.toString()}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.routeOpen) {
                  setValue("routeId", +value);
                  setError("routeId", { type: "custom", message: "" });
                }
              }}
            >
              <SelectTrigger id="routeId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.routeId.placeholder.bn,
                    addUpdateCoachConfigurationForm.routeId.placeholder.en
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

          {/* DEPARTURE DATE */}
          <InputWrapper
            error={errors?.departureDate?.message}
            labelFor="departureDate"
            label={translate(
              addUpdateCoachConfigurationForm.departureDate.label.bn,
              addUpdateCoachConfigurationForm.departureDate.label.en
            )}
          >
            <Popover
              open={updateCoachConfigurationFormState.calendarOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    calendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="departureDate" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateCoachConfigurationFormState.date &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateCoachConfigurationFormState.date ? (
                    format(updateCoachConfigurationFormState.date, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateCoachConfigurationForm.departureDate
                          .placeholder.bn,
                        addUpdateCoachConfigurationForm.departureDate
                          .placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={
                    updateCoachConfigurationFormState?.date || new Date()
                  }
                  onSelect={(date: any) => {
                    //@ts-ignore
                    setValue(
                      "departureDate",
                      //@ts-ignore
                      date
                        ? format(date, "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd")
                    );
                    //@ts-ignore
                    setError("departureDate", { type: "custom", message: "" });
                    setUpdateCoachConfigurationFormState(
                      (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                        ...prevState,
                        calendarOpen: false,
                        date: date || new Date(),
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* SUPERVISOR */}
          <InputWrapper
            error={errors?.supervisorId?.message}
            labelFor="supervisorId"
            label={translate(
              addUpdateCoachConfigurationForm?.supervisorId.label.bn,
              addUpdateCoachConfigurationForm.supervisorId.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.supervisorOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    supervisorOpen: open,
                  })
                )
              }
              value={watch("supervisorId")?.toString() || ""}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.supervisorOpen) {
                  setValue("supervisorId", +value);
                  setError("supervisorId", { type: "custom", message: "" });
                }
              }}
            >
              <SelectTrigger id="supervisorId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.supervisorId.placeholder.bn,
                    addUpdateCoachConfigurationForm.supervisorId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!supervisorsLoading &&
                  supervisorsData?.data?.length > 0 &&
                  supervisorsData?.data
                    .filter(
                      (target: any) =>
                        target?.role?.name.toLowerCase() === "supervisor"
                    )
                    ?.map((supervisor: any, index: number) => (
                      <SelectItem
                        key={index}
                        value={supervisor?.id?.toString()}
                      >
                        {formatter({
                          type: "words",
                          words: supervisor?.userName,
                        })}
                      </SelectItem>
                    ))}

                {supervisorsLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* Driver */}
          <InputWrapper
            error={errors?.driverId?.message}
            labelFor="driverId"
            label={translate(
              addUpdateCoachConfigurationForm?.driverId.label.bn,
              addUpdateCoachConfigurationForm.driverId.label.en
            )}
          >
            <Select
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    driverOpen: open,
                  })
                )
              }
              value={watch("driverId")?.toString() || ""}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.driverOpen) {
                  setValue("driverId", +value);
                  setError("driverId", { type: "custom", message: "" });
                }
              }}
            >
              <SelectTrigger id="driverId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.driverId.placeholder.bn,
                    addUpdateCoachConfigurationForm.driverId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!driverDataLoading &&
                  driverData?.data?.length > 0 &&
                  driverData?.data?.map((driver: any, index: number) => (
                    <SelectItem key={index} value={driver?.id?.toString()}>
                      {formatter({
                        type: "words",
                        words: driver?.name,
                      })}
                    </SelectItem>
                  ))}

                {driverDataLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* STARTING COUNTER */}
          <InputWrapper
            error={errors?.fromCounterId?.message}
            labelFor="fromCounterId"
            label={translate(
              addUpdateCoachConfigurationForm?.fromCounterId.label.bn,
              addUpdateCoachConfigurationForm.fromCounterId.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.startingCounterOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    startingCounterOpen: open,
                  })
                )
              }
              value={watch("fromCounterId")?.toString()}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.startingCounterOpen) {
                  setValue("fromCounterId", +value);
                  setError("fromCounterId", { type: "custom", message: "" });
                }
              }}
            >
              <SelectTrigger id="fromCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.fromCounterId.placeholder
                      .bn,
                    addUpdateCoachConfigurationForm.fromCounterId.placeholder.en
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
          </InputWrapper>

          {/* ENDING COUNTER */}
          <InputWrapper
            error={errors?.destinationCounterId?.message}
            labelFor="destinationCounterId"
            label={translate(
              addUpdateCoachConfigurationForm?.destinationCounterId.label.bn,
              addUpdateCoachConfigurationForm.destinationCounterId.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.endingCounterOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    endingCounterOpen: open,
                  })
                )
              }
              value={watch("destinationCounterId")?.toString()}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.endingCounterOpen) {
                  setValue("destinationCounterId", +value);
                  setError("destinationCounterId", {
                    type: "custom",
                    message: "",
                  });
                }
              }}
            >
              <SelectTrigger id="destinationCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.destinationCounterId
                      .placeholder.bn,
                    addUpdateCoachConfigurationForm.destinationCounterId
                      .placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!countersLoading &&
                  countersData?.data?.length > 0 &&
                  countersData?.data
                    .filter(
                      (target: any) => target?.id !== +watch("fromCounterId")
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
          </InputWrapper>

          {/* COACH CLASS */}
          <InputWrapper
            error={errors?.coachClass?.message}
            labelFor="coachClass"
            label={translate(
              //@ts-ignore
              addUpdateCoachConfigurationForm?.coachClass.label.bn,
              //@ts-ignore
              addUpdateCoachConfigurationForm.coachClass.label.en
            )}
          >
            <Select
              value={watch("coachClass") || ""}
              onValueChange={(
                value: "E_Class" | "B_Class" | "S_Class" | "Sleeper"
              ) => {
                setValue("coachClass", value);
                setError("coachClass", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachClass" className="w-full">
                <SelectValue
                  placeholder={translate(
                    //@ts-ignore
                    addUpdateCoachConfigurationForm.coachClass.placeholder.bn,
                    //@ts-ignore
                    addUpdateCoachConfigurationForm.coachClass.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {coachClasses.map((coachClass, index) => (
                  <SelectItem key={index} value={coachClass.value}>
                    {translate(coachClass.bn, coachClass.en)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* COACH TYPE */}
          <InputWrapper
            error={errors?.coachType?.message}
            labelFor="coachType"
            label={translate(
              addUpdateCoachConfigurationForm?.coachType.label.bn,
              addUpdateCoachConfigurationForm.coachType.label.en
            )}
          >
            <Select
              value={watch("coachType") || ""}
              onValueChange={(value: "AC" | "NON AC") => {
                setValue("coachType", value);
                setError("coachType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.coachType.placeholder.bn,
                    addUpdateCoachConfigurationForm.coachType.placeholder.en
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
          {/* FARE AMOUNT */}
          <InputWrapper
            error={errors?.fareId?.message}
            labelFor="fareId"
            label={translate(
              addUpdateCoachConfigurationForm?.fareId.label.bn,
              addUpdateCoachConfigurationForm.fareId.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.fareOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState(
                  (prevState: IUpdateCoachConfigurationFormStateProps) => ({
                    ...prevState,
                    fareOpen: open,
                  })
                )
              }
              value={watch("fareId") ? watch("fareId")?.toString() : ""}
              onValueChange={(value: string) => {
                if (updateCoachConfigurationFormState.fareOpen) {
                  setValue("fareId", +value);
                  setError("fareId", {
                    type: "custom",
                    message: "",
                  });
                }
              }}
            >
              <SelectTrigger id="fareId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.fareId.placeholder.bn,
                    addUpdateCoachConfigurationForm.fareId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!faresLoading &&
                  faresData?.data?.length > 0 &&
                  faresData?.data?.map((singleFare: any, fareIndex: number) => (
                    <SelectItem
                      key={fareIndex}
                      value={singleFare?.id?.toString()}
                    >
                      {singleFare?.amount}
                    </SelectItem>
                  ))}

                {faresLoading && !faresData?.data?.length && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* token amount */}
          <InputWrapper
            error={errors?.tokenAvailable?.message}
            labelFor="tokenAvailable"
            label={translate(
              addUpdateCoachConfigurationForm?.tokenAvailable.label.bn,
              addUpdateCoachConfigurationForm.tokenAvailable.label.en
            )}
          >
            <Input
              id="tokenAvailable"
              {...register("tokenAvailable")}
              type="number"
              placeholder={translate(
                addUpdateCoachConfigurationForm.tokenAvailable.placeholder.bn,
                addUpdateCoachConfigurationForm.tokenAvailable.placeholder.en
              )}
            />
          </InputWrapper>
          {/* SCHEDULE */}
          <InputWrapper
            error={errors?.schedule?.message}
            labelFor="schedule"
            label={translate(
              addUpdateCoachConfigurationForm?.schedule.label.bn,
              addUpdateCoachConfigurationForm.schedule.label.en
            )}
          >
            <Select
              open={updateCoachConfigurationFormState.scheduleOpen}
              onOpenChange={(open) =>
                setUpdateCoachConfigurationFormState((prevState) => ({
                  ...prevState,
                  scheduleOpen: open,
                }))
              }
              value={watch("schedule")} // Ensure this is showing the value from the database
              onValueChange={(value: string) => {
                setValue("schedule", value); // Update the selected value
                setError("schedule", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="schedule" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.schedule.placeholder.bn,
                    addUpdateCoachConfigurationForm.schedule.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!schedulesLoading &&
                  schedulesData?.data?.map(
                    (singleSchedule: any, index: number) => (
                      <SelectItem key={index} value={singleSchedule?.time}>
                        {singleSchedule?.time}
                      </SelectItem>
                    )
                  )}

                {schedulesLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* SALE STATUS */}
          <InputWrapper
            error={errors?.active?.message}
            labelFor="active"
            label={translate(
              addUpdateCoachConfigurationForm?.active.label.bn,
              addUpdateCoachConfigurationForm.active.label.en
            )}
          >
            <Select
              value={watch("active") ? "Yes" : "No"}
              onValueChange={(value: "Yes" | "No") => {
                setValue("active", value === "Yes" ? true : false);
                setError("active", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="active" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.active.placeholder.bn,
                    addUpdateCoachConfigurationForm.active.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">{translate("হ্যাঁ", "Yes")}</SelectItem>
                <SelectItem value="No">{translate("না", "No")}</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* discount */}
          {/* disocunt*/}
          <InputWrapper
            error={errors.discount?.message}
            labelFor="discount"
            label={translate(
              addUpdateCoachConfigurationForm?.discount.label.bn,
              addUpdateCoachConfigurationForm?.discount.label.en
            )}
          >
            <Input
              value={watch("discount")}
              id="discount"
              {...register("discount")}
              type="number"
              placeholder={translate(
                addUpdateCoachConfigurationForm.discount.placeholder.bn,
                addUpdateCoachConfigurationForm.discount.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>
        <Submit
          loading={updateCoachConfigurationLoading}
          errors={updateCoachConfigurationError}
          submitTitle={translate(
            "কোচ কনফিগারেইশন সম্পাদন করুন",
            "Update Coach Configuration"
          )}
          errorTitle={translate(
            "কোচ কনফিগারেইশন সম্পাদন করতে ত্রুটি",
            "Update Coach Configuration Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCoachConfiguration;
