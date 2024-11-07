import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateStationDataProps,
  addUpdateStationSchema,
} from "@/schemas/vehiclesSchedule/addUpdateStationSchema";
import {
  useGetSingleStationQuery,
  useUpdateStationMutation,
} from "@/store/api/vehiclesSchedule/stationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";

interface IUpdateStationProps {
  id: number | null;
}

const UpdateStation: FC<IUpdateStationProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateStationDataProps>({
    resolver: zodResolver(addUpdateStationSchema),
  });

  const [
    updateStation,
    { isLoading: updateStationLoading, error: updateStationError },
  ] = useUpdateStationMutation();

  const { data: stationData, isLoading: stationLoading } =
    useGetSingleStationQuery(id);

  useEffect(() => {
    setValue("name", stationData?.data?.name);
  }, [stationData, setValue]);

  const onSubmit = async (data: AddUpdateStationDataProps) => {
    const result = await updateStation({ data, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "স্টেশন সম্পাদন করার বার্তা",
          "Message for updating station"
        ),
        description: toastMessage("update", translate("স্টেশন", "station")),
      });
    }
  };

  if (stationLoading) {
    return <FormSkeleton columns={1} inputs={1} />;
  }
  return (
    <FormWrapper
      heading={translate("স্টেশন সম্পাদন করুন", "Update Station")}
      subHeading={translate(
        "সিস্টেমে স্টেশন সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing station to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="name"
            label={translate("স্টেশনের নাম ✼", "Station Name ✼")}
          >
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder={translate(
                "স্টেশনের নাম লিখুন",
                "Enter station name"
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updateStationLoading}
          errors={updateStationError}
          submitTitle={translate("স্টেশন সম্পাদন করুন", "Update Station")}
          errorTitle={translate(
            "স্টেশন সম্পাদন করতে ত্রুটি",
            "Update Station Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateStation;
