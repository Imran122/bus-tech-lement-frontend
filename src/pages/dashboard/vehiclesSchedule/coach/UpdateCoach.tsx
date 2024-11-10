import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
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
import {
  AddUpdateCoachDataProps,
  addUpdateCoachSchema,
} from "@/schemas/vehiclesSchedule/addUpdateCoachSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import {
  useGetSingleCoachQuery,
  useUpdateCoachMutation,
} from "@/store/api/vehiclesSchedule/coachApi";
import { useGetFaresQuery } from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { addUpdateCoachForm } from "@/utils/constants/form/addUpdateCoachForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IUpdateCoachProps {
  id: number | null;
}

const UpdateCoach: FC<IUpdateCoachProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,

    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateCoachDataProps>({
    resolver: zodResolver(addUpdateCoachSchema),
  });

  const { data: coachData, isLoading: coachLoading } =
    useGetSingleCoachQuery(id);
  const [
    updateCoach,
    { isLoading: updateCoachLoading, error: updateCoachError },
  ] = useUpdateCoachMutation();

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({});
  const { data: countersData, isLoading: countersLoading } =
    useGetCountersQuery({});
  const { data: faresData, isLoading: faresLoading } = useGetFaresQuery({});
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery({});

  useEffect(() => {
    if (coachData?.data) {
      const data = coachData.data;
      setValue("coachNo", data.coachNo);
      setValue("active", data.active);
      setValue("noOfSeat", data.noOfSeat);
      setValue("fromCounterId", data.fromCounterId);
      setValue("fareId", data.fareId);
      setValue("routeId", data.routeId);
      setValue("destinationCounterId", data.destinationCounterId);
      setValue("schedule", data.schedule);
    }
  }, [coachData, setValue]);

  const onSubmit = async (data: AddUpdateCoachDataProps) => {
    const result = await updateCoach({ data, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ সম্পাদনা করার বার্তা",
          "Message for updating coach"
        ),
        description: toastMessage("update", translate("কোচ", "coach")),
      });
    }
  };

  if (coachLoading) return <SelectSkeleton />;

  return (
    <FormWrapper
      heading={translate("কোচ সম্পাদনা করুন", "Update Coach")}
      subHeading={translate(
        "সিস্টেমে কোচ সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing coach to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <InputWrapper
            error={errors.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachForm?.coachNo.label.bn,
              addUpdateCoachForm.coachNo.label.en
            )}
          >
            <Input
              id="coachNo"
              {...register("coachNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.coachNo.placeholder.bn,
                addUpdateCoachForm.coachNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* Starting Counter */}
          <InputWrapper
            error={errors?.fromCounterId?.message}
            labelFor="fromCounterId"
            label={translate(
              addUpdateCoachForm?.fromCounterId.label.bn,
              addUpdateCoachForm.fromCounterId.label.en
            )}
          >
            <Select
              value={watch("fromCounterId")?.toString()}
              onValueChange={(value) => setValue("fromCounterId", +value)}
            >
              <SelectTrigger id="fromCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.fromCounterId.placeholder.bn,
                    addUpdateCoachForm.fromCounterId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!countersLoading &&
                  countersData?.data?.map((counter: any, idx: number) => (
                    <SelectItem key={idx} value={counter.id.toString()}>
                      {counter.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Ending Counter */}
          <InputWrapper
            error={errors.destinationCounterId?.message}
            labelFor="destinationCounterId"
            label={translate(
              addUpdateCoachForm.destinationCounterId.label.bn,
              addUpdateCoachForm.destinationCounterId.label.en
            )}
          >
            <Select
              value={watch("destinationCounterId")?.toString()}
              onValueChange={(value) =>
                setValue("destinationCounterId", +value)
              }
            >
              <SelectTrigger id="destinationCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.destinationCounterId.placeholder.bn,
                    addUpdateCoachForm.destinationCounterId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!countersLoading &&
                  countersData?.data?.map(
                    (counter: { name: string; id: number }, idx: any) => (
                      <SelectItem key={idx} value={counter.id.toString()}>
                        {counter.name}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Fare Amount */}
          <InputWrapper
            error={errors.fareId?.message}
            labelFor="fareId"
            label={translate(
              addUpdateCoachForm.fareId.label.bn,
              addUpdateCoachForm.fareId.label.en
            )}
          >
            <Select
              value={watch("fareId")?.toString()}
              onValueChange={(value) => setValue("fareId", +value)}
            >
              <SelectTrigger id="fareId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.fareId.placeholder.bn,
                    addUpdateCoachForm.fareId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!faresLoading &&
                  faresData?.data?.map((fare: any, idx: number) => (
                    <SelectItem key={idx} value={fare.id.toString()}>
                      {fare.amount}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Route */}
          <InputWrapper
            error={errors.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateCoachForm.routeId.label.bn,
              addUpdateCoachForm.routeId.label.en
            )}
          >
            <Select
              value={watch("routeId")?.toString()}
              onValueChange={(value) => setValue("routeId", +value)}
            >
              <SelectTrigger id="routeId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.routeId.placeholder.bn,
                    addUpdateCoachForm.routeId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!routesLoading &&
                  routesData?.data?.map((route: any, idx: any) => (
                    <SelectItem key={idx} value={route.id.toString()}>
                      {route.routeName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Schedule */}
          <InputWrapper
            error={errors.schedule?.message}
            labelFor="schedule"
            label={translate(
              addUpdateCoachForm.schedule.label.bn,
              addUpdateCoachForm.schedule.label.en
            )}
          >
            <Select
              value={watch("schedule")}
              onValueChange={(value) => setValue("schedule", value)}
            >
              <SelectTrigger id="schedule" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.schedule.placeholder.bn,
                    addUpdateCoachForm.schedule.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!schedulesLoading &&
                  schedulesData?.data?.map((schedule: any, idx: any) => (
                    <SelectItem key={idx} value={schedule.time}>
                      {schedule.time}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* Number of Seats */}
          <InputWrapper
            labelFor="noOfSeat"
            error={errors?.noOfSeat?.message}
            label={translate(
              addUpdateCoachForm.noOfSeat.label.bn,
              addUpdateCoachForm.noOfSeat.label.en
            )}
          >
            <Select
              value={watch("noOfSeat")?.toString() || ""}
              onValueChange={(value) => setValue("noOfSeat", parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.noOfSeat.placeholder.bn,
                    addUpdateCoachForm.noOfSeat.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="28">Ac Business Class (28 seats)</SelectItem>
                <SelectItem value="30">Sleeper Coach (30 Seats)</SelectItem>
                <SelectItem value="41">Ac Economy Class (41 Seats)</SelectItem>
                <SelectItem value="43">Suite Class (43 Seats)</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
        </div>

        <Submit
          loading={updateCoachLoading}
          errors={updateCoachError}
          submitTitle={translate("কোচ সম্পাদনা করুন", "Update Coach")}
          errorTitle={translate(
            "কোচ সম্পাদনা করতে ত্রুটি",
            "Update Coach Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCoach;
