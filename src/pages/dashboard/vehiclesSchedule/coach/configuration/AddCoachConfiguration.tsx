import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";

import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addUpdateCoachConfigurationSchema,
  IAddUpdateCoachConfigurationDataProps,
} from "@/schemas/vehiclesSchedule/addUpdateCoachConfigurationSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetDriversQuery } from "@/store/api/contact/driverApi";
import { useGetUsersQuery } from "@/store/api/contact/userApi";
import { useGetCoachesQuery } from "@/store/api/vehiclesSchedule/coachApi";
import { useAddCoachConfigurationMutation } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useGetFaresQuery } from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ICoachConfigurationStateProps } from "./CoachConfigurationList";

interface IAddCoachConfigurationProps {
  setCoachConfigurationState: (
    coachConfigurationState: (
      prevState: ICoachConfigurationStateProps
    ) => ICoachConfigurationStateProps
  ) => void;
}

interface IAddCoachConfigurationFormStateProps {
  date: Date | null;
  calendarOpen: boolean;
}

const AddCoachConfiguration: FC<IAddCoachConfigurationProps> = ({
  setCoachConfigurationState,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [addCoachConfigurationFormState, setAddCoachConfigurationFormState] =
    useState<IAddCoachConfigurationFormStateProps>({
      date: null,
      calendarOpen: false,
    });
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

  const [
    addCoachConfiguration,
    {
      isLoading: addCoachConfigurationLoading,
      error: addCoachConfigurationError,
    },
  ] = useAddCoachConfigurationMutation();

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({}) as any;

  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({}) as any;

  const { data: faresData, isLoading: faresLoading } = useGetFaresQuery(
    {}
  ) as any;

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: supervisorsData, isLoading: supervisorsLoading } =
    useGetUsersQuery({}) as any;
  const { data: driverData, isLoading: driverDataLoading } = useGetDriversQuery(
    {}
  ) as any;
  const { data: coachListData, isLoading: coachListDataLoading } =
    useGetCoachesQuery({}) as any;
  console.log("coachListData", coachListData);
  const onSubmit = async (data: IAddUpdateCoachConfigurationDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "registrationNo",
      "holdingTime",
      "holdingTime",
      "vipTimeOut",
      "fareAllowed",
    ]);

    const result = await addCoachConfiguration(updateData);
    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ কনফিগারেইশন যোগ করার বার্তা",
          "Message for adding coach configuration"
        ),
        description: toastMessage(
          "add",
          translate("কোচ কনফিগারেইশন", "coach configuration")
        ),
      });
      setCoachConfigurationState(
        (prevState: ICoachConfigurationStateProps) => ({
          ...prevState,
          addCoachConfigurationOpen: false,
        })
      );
    }
  };
  //const registrationNo = watch("registrationNo");
  const selectedCoachNo = watch("coachNo");
  useEffect(() => {
    // Find the selected coach's data
    const selectedCoach = coachListData?.data.find(
      (coach: any) => coach.coachNo === selectedCoachNo
    );

    // If a matching coach is found, set its registration number
    if (selectedCoach) {
      setValue("registrationNo", selectedCoach.registrationNo);
    }
  }, [selectedCoachNo, setValue, coachListData]);

  console.log("supervisorsData", supervisorsData);

  if (supervisorsLoading || coachListDataLoading) {
    return <FormSkeleton columns={7} />;
  }

  return (
    <FormWrapper
      heading={translate("কোচ কনফিগারেইশন যোগ করুন", "Add Coach Configuration")}
      subHeading={translate(
        "সিস্টেমে কোচ কনফিগারেইশন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new coach configuration to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* coach NUMBER */}

          <InputWrapper
            error={errors?.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachConfigurationForm?.coachNo.label.bn,
              addUpdateCoachConfigurationForm.coachNo.label.en
            )}
          >
            <Select
              value={watch("coachNo") || ""} // No need to convert to string here
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
            //@ts-ignore
            disabled={true}
            label={translate(
              addUpdateCoachConfigurationForm?.registrationNo.label.bn,
              addUpdateCoachConfigurationForm?.registrationNo.label.en
            )}
          >
            <Input
              id="registrationNo"
              {...register("registrationNo")}
              type="text"
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
              value={watch("routeId")?.toString()}
              onValueChange={(value: string) => {
                setValue("routeId", +value);
                setError("routeId", { type: "custom", message: "" });
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
              open={addCoachConfigurationFormState.calendarOpen}
              onOpenChange={(open) =>
                setAddCoachConfigurationFormState(
                  (prevState: IAddCoachConfigurationFormStateProps) => ({
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
                    !addCoachConfigurationFormState.date &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addCoachConfigurationFormState.date ? (
                    format(addCoachConfigurationFormState.date, "PPP")
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
                  selected={addCoachConfigurationFormState?.date || new Date()}
                  onSelect={(date) => {
                    setValue(
                      "departureDate",
                      date
                        ? format(date, "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd")
                    );
                    setError("departureDate", { type: "custom", message: "" });
                    setAddCoachConfigurationFormState(
                      (prevState: IAddCoachConfigurationFormStateProps) => ({
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
              value={watch("supervisorId")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("supervisorId", +value);
                setError("supervisorId", { type: "custom", message: "" });
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
              value={watch("driverId")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("driverId", +value);
                setError("driverId", { type: "custom", message: "" });
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
              value={watch("fromCounterId")?.toString()}
              onValueChange={(value: string) => {
                setValue("fromCounterId", +value);
                setError("fromCounterId", { type: "custom", message: "" });
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
              value={watch("destinationCounterId")?.toString()}
              onValueChange={(value: string) => {
                setValue("destinationCounterId", +value);
                setError("destinationCounterId", {
                  type: "custom",
                  message: "",
                });
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
              value={watch("fareId") ? watch("fareId")?.toString() : ""}
              onValueChange={(value: string) => {
                setValue("fareId", +value);
                setError("fareId", {
                  type: "custom",
                  message: "",
                });
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
              value={watch("schedule")}
              onValueChange={(value: string) => {
                setValue("schedule", value);
                setError("schedule", {
                  type: "custom",
                  message: "",
                });
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
                  schedulesData?.data?.length > 0 &&
                  schedulesData?.data?.map(
                    (singleSchedule: any, scheduleIndex: number) => (
                      <SelectItem
                        key={scheduleIndex}
                        value={singleSchedule?.time}
                      >
                        {singleSchedule?.time}
                      </SelectItem>
                    )
                  )}

                {schedulesLoading && !schedulesData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* TYPE */}
          <InputWrapper
            error={errors?.type?.message}
            labelFor="type"
            label={translate(
              addUpdateCoachConfigurationForm?.type.label.bn,
              addUpdateCoachConfigurationForm.type.label.en
            )}
          >
            <Select
              value={watch("type") || ""}
              onValueChange={(value: "Daily" | "Weekly") => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.type.placeholder.bn,
                    addUpdateCoachConfigurationForm.type.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">
                  {translate("দৈনিক", "Daily")}
                </SelectItem>
                <SelectItem value="Weekly">
                  {translate("সাপ্তাহিক", "Weekly")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* SALE STATUS */}
          <InputWrapper
            error={errors?.saleStatus?.message}
            labelFor="saleStatus"
            label={translate(
              addUpdateCoachConfigurationForm?.saleStatus.label.bn,
              addUpdateCoachConfigurationForm.saleStatus.label.en
            )}
          >
            <Select
              value={watch("saleStatus") ? "Yes" : "No"}
              onValueChange={(value: "Yes" | "No") => {
                setValue("saleStatus", value === "Yes" ? true : false);
                setError("saleStatus", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="saleStatus" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.saleStatus.placeholder.bn,
                    addUpdateCoachConfigurationForm.saleStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">{translate("হ্যাঁ", "Yes")}</SelectItem>
                <SelectItem value="No">{translate("না", "No")}</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* HOLDING TIME */}
          <InputWrapper
            error={errors?.holdingTime?.message}
            labelFor="holdingTime"
            label={translate(
              addUpdateCoachConfigurationForm?.holdingTime.label.bn,
              addUpdateCoachConfigurationForm.holdingTime.label.en
            )}
          >
            <Input
              id="holdingTime"
              {...register("holdingTime")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.holdingTime.placeholder.bn,
                addUpdateCoachConfigurationForm.holdingTime.placeholder.en
              )}
            />
          </InputWrapper>
          {/* FARE ALLOWED */}
          <InputWrapper
            error={errors?.fareAllowed?.message}
            labelFor="fareAllowed"
            label={translate(
              addUpdateCoachConfigurationForm?.fareAllowed.label.bn,
              addUpdateCoachConfigurationForm.fareAllowed.label.en
            )}
          >
            <Input
              id="fareAllowed"
              {...register("fareAllowed")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.fareAllowed.placeholder.bn,
                addUpdateCoachConfigurationForm.fareAllowed.placeholder.en
              )}
            />
          </InputWrapper>
          {/* VIP TIME OUT */}
          <InputWrapper
            error={errors?.vipTimeOut?.message}
            labelFor="vipTimeOut"
            label={translate(
              addUpdateCoachConfigurationForm?.vipTimeOut.label.bn,
              addUpdateCoachConfigurationForm.vipTimeOut.label.en
            )}
          >
            <Input
              id="vipTimeOut"
              {...register("vipTimeOut")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.vipTimeOut.placeholder.bn,
                addUpdateCoachConfigurationForm.vipTimeOut.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>
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
