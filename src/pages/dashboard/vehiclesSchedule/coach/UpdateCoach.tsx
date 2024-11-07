import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AddUpdateCoachDataProps,
  addUpdateCoachSchema,
} from "@/schemas/vehiclesSchedule/addUpdateCoachSchema";
import {
  useGetSingleCoachQuery,
  useUpdateCoachMutation,
} from "@/store/api/vehiclesSchedule/coachApi";
import { addUpdateCoachForm } from "@/utils/constants/form/addUpdateCoachForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";

import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IAddCoachProps {
  id: number | null;
}
interface IAddCoachFormStateProps {
  date: Date | null;
  calendarOpen: boolean;
}

const UpdateCoach: FC<IAddCoachProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [addCoachFormState, setAddCoachFormState] =
    useState<IAddCoachFormStateProps>({
      date: null,
      calendarOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateCoachDataProps>({
    resolver: zodResolver(addUpdateCoachSchema),
  });

  const { data: coachData, isLoading: coachLoading } =
    useGetSingleCoachQuery(id);

  const [updateCoach, { isLoading: addCoachLoading, error: addCoachError }] =
    useUpdateCoachMutation();

  useEffect(() => {
    setValue("active", coachData?.data?.active);
    setValue("chasisNo", coachData?.data?.chasisNo);
    setValue("coachType", coachData?.data?.coachType);
    setValue("color", coachData?.data?.color);
    setValue("countryOfOrigin", coachData?.data?.countryOfOrigin);
    setValue("deliveryDate", coachData?.data?.deliveryDate);
    setValue("deliveryToDipo", coachData?.data?.deliveryToDipo);
    setValue("engineNo", coachData?.data?.engineNo);
    setValue("financedBy", coachData?.data?.financedBy);
    setValue("lcCode", coachData?.data?.lcCode);
    setValue("manufacturerCompany", coachData?.data?.manufacturerCompany);
    setValue("model", coachData?.data?.model);
    setValue("noOfSeat", coachData?.data?.noOfSeat);
    setValue("registrationNo", coachData?.data?.registrationNo);
    setValue("coachNo", coachData?.data?.coachNo);
    setValue("terms", coachData?.data?.terms);

    setAddCoachFormState((prevState: IAddCoachFormStateProps) => ({
      ...prevState,
      date: coachData?.data?.deliveryDate,
    }));
  }, [coachData, setValue]);

  const onSubmit = async (data: AddUpdateCoachDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "manufacturerCompany",
      "model",
      "chasisNo",
      "engineNo",
      "countryOfOrigin",
      "lcCode",
      "deliveryToDipo",
      "deliveryDate",
      "color",
      "financedBy",
      "terms",
    ]);

    const result = await updateCoach({ data: updateData, id });
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

  if (coachLoading) {
    return <FormSkeleton columns={3} inputs={15} />;
  }
  return (
    <FormWrapper
      heading={translate("কোচ সম্পাদন করুন", "Update Coach")}
      subHeading={translate(
        "সিস্টেমে নতুন কোচ সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing coach to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* COACH NUMBER */}
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
          {/* REGISTRATION NUMBER */}
          <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              addUpdateCoachForm?.registrationNo.label.bn,
              addUpdateCoachForm.registrationNo.label.en
            )}
          >
            <Input
              id="registrationNo"
              {...register("registrationNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.registrationNo.placeholder.bn,
                addUpdateCoachForm.registrationNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* NUMBER OF SEAT */}
          <InputWrapper
            labelFor="noOfSeat"
            error={errors?.noOfSeat?.message}
            label={translate(
              addUpdateCoachForm.noOfSeat.label.bn,
              addUpdateCoachForm.noOfSeat.label.en
            )}
          >
            <Input
              id="noOfSeat"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setValue("noOfSeat", +e.target.value);
                setError("noOfSeat", { type: "custom", message: "" });
              }}
              type="number"
              placeholder={translate(
                addUpdateCoachForm.noOfSeat.placeholder.bn,
                addUpdateCoachForm.noOfSeat.placeholder.en
              )}
            />
          </InputWrapper>
          {/* COACH TYPE */}
          <InputWrapper
            error={errors?.coachType?.message}
            labelFor="coachType"
            label={translate(
              addUpdateCoachForm?.coachType.label.bn,
              addUpdateCoachForm.coachType.label.en
            )}
          >
            <Select
              value={watch("coachType") || ""}
              onValueChange={(value: "Single_Deck" | "Double_Deck") => {
                setValue("coachType", value);
                setError("coachType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.coachType.placeholder.bn,
                    addUpdateCoachForm.coachType.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single_Deck">
                  {translate("সিঙ্গেল ডেক", "Single Deck")}
                </SelectItem>
                <SelectItem value="Double_Deck">
                  {translate("ডাবল ডেক", "Double Deck")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* ACTIVITY STATUS */}
          <InputWrapper
            labelFor="status"
            error={errors?.active?.message}
            label={translate(
              addUpdateCoachForm?.active.label.bn,
              addUpdateCoachForm.active.label.en
            )}
          >
            <Select
              onValueChange={(value: "Activated" | "Deactivated") => {
                setValue(
                  "active",
                  value?.toLowerCase() === "activated" ? true : false
                );
                setError("active", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.active.placeholder.bn,
                    addUpdateCoachForm.active.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activated">
                  {translate("সক্রিয়", "Activated")}
                </SelectItem>
                <SelectItem value="Deactivated">
                  {translate("নিষ্ক্রিয়", "Deactivate")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* MANUFACTURE COMPANY */}
          <InputWrapper
            error={errors?.manufacturerCompany?.message}
            labelFor="manufacturerCompany"
            label={translate(
              addUpdateCoachForm?.manufacturerCompany.label.bn,
              addUpdateCoachForm.manufacturerCompany.label.en
            )}
          >
            <Input
              id="manufacturerCompany"
              {...register("manufacturerCompany")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.manufacturerCompany.placeholder.bn,
                addUpdateCoachForm.manufacturerCompany.placeholder.en
              )}
            />
          </InputWrapper>
          {/* MODEL */}
          <InputWrapper
            error={errors?.model?.message}
            labelFor="model"
            label={translate(
              addUpdateCoachForm?.model.label.bn,
              addUpdateCoachForm.model.label.en
            )}
          >
            <Input
              id="model"
              {...register("model")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.model.placeholder.bn,
                addUpdateCoachForm.model.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CHASSIS NUMBER */}
          <InputWrapper
            labelFor="chasisNo"
            error={errors?.chasisNo?.message}
            label={translate(
              addUpdateCoachForm?.chasisNo.label.bn,
              addUpdateCoachForm.chasisNo.label.en
            )}
          >
            <Input
              id="chasisNo"
              {...register("chasisNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.chasisNo.placeholder.bn,
                addUpdateCoachForm.chasisNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ENGINE NUMBER */}
          <InputWrapper
            labelFor="engineNo"
            error={errors?.engineNo?.message}
            label={translate(
              addUpdateCoachForm?.engineNo.label.bn,
              addUpdateCoachForm.engineNo.label.en
            )}
          >
            <Input
              id="engineNo"
              {...register("engineNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.engineNo.placeholder.bn,
                addUpdateCoachForm.engineNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* COUNTRY OF ORIGIN */}
          <InputWrapper
            labelFor="countryOfOrigin"
            error={errors?.countryOfOrigin?.message}
            label={translate(
              addUpdateCoachForm?.countryOfOrigin.label.bn,
              addUpdateCoachForm.countryOfOrigin.label.en
            )}
          >
            <Input
              id="countryOfOrigin"
              {...register("countryOfOrigin")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.countryOfOrigin.placeholder.bn,
                addUpdateCoachForm.countryOfOrigin.placeholder.en
              )}
            />
          </InputWrapper>
          {/* LC CODE */}
          <InputWrapper
            labelFor="lcCode"
            error={errors?.lcCode?.message}
            label={translate(
              addUpdateCoachForm?.lcCode.label.bn,
              addUpdateCoachForm.lcCode.label.en
            )}
          >
            <Input
              id="lcCode"
              {...register("lcCode")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.lcCode.placeholder.bn,
                addUpdateCoachForm.lcCode.placeholder.en
              )}
            />
          </InputWrapper>
          {/* DELIVERY TO DEPOT */}
          <InputWrapper
            labelFor="deliveryToDipo"
            error={errors?.deliveryToDipo?.message}
            label={translate(
              addUpdateCoachForm?.deliveryToDipo.label.bn,
              addUpdateCoachForm.deliveryToDipo.label.en
            )}
          >
            <Input
              id="deliveryToDipo"
              {...register("deliveryToDipo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.deliveryToDipo.placeholder.bn,
                addUpdateCoachForm.deliveryToDipo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* DELIVERY DATE */}
          <InputWrapper
            error={errors?.deliveryDate?.message}
            labelFor="deliveryDate"
            label={translate(
              addUpdateCoachForm.deliveryDate.label.bn,
              addUpdateCoachForm.deliveryDate.label.en
            )}
          >
            <Popover
              open={addCoachFormState.calendarOpen}
              onOpenChange={(open) =>
                setAddCoachFormState((prevState: IAddCoachFormStateProps) => ({
                  ...prevState,
                  calendarOpen: open,
                }))
              }
            >
              <PopoverTrigger id="deliveryDate" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addCoachFormState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addCoachFormState.date ? (
                    format(addCoachFormState.date, "PPP")
                  ) : (
                    <span>
                      {translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={addCoachFormState?.date || new Date()}
                  onSelect={(date) => {
                    setValue("deliveryDate", date);
                    setError("deliveryDate", { type: "custom", message: "" });
                    setAddCoachFormState(
                      (prevState: IAddCoachFormStateProps) => ({
                        ...prevState,
                        calendarOpen: false,
                        date: date || null,
                      })
                    );
                  }}
                  fromYear={1960}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
          {/* COLOR */}
          <InputWrapper
            labelFor="color"
            error={errors?.color?.message}
            label={translate(
              addUpdateCoachForm?.color.label.bn,
              addUpdateCoachForm.color.label.en
            )}
          >
            <Input
              id="color"
              {...register("color")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.color.placeholder.bn,
                addUpdateCoachForm.color.placeholder.en
              )}
            />
          </InputWrapper>

          {/* FINANCE BY */}
          <InputWrapper
            labelFor="financedBy"
            error={errors?.financedBy?.message}
            label={translate(
              addUpdateCoachForm?.financedBy.label.bn,
              addUpdateCoachForm.financedBy.label.en
            )}
          >
            <Input
              id="financedBy"
              {...register("financedBy")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.financedBy.placeholder.bn,
                addUpdateCoachForm.financedBy.placeholder.en
              )}
            />
          </InputWrapper>

          {/* TERMS & CONDITION */}
          <InputWrapper
            labelFor="terms"
            error={errors?.terms?.message}
            className="col-span-3"
            label={translate(
              addUpdateCoachForm?.terms.label.bn,
              addUpdateCoachForm.terms.label.en
            )}
          >
            <Textarea
              id="terms"
              {...register("terms")}
              placeholder={translate(
                addUpdateCoachForm.terms.placeholder.bn,
                addUpdateCoachForm.terms.placeholder.en
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={addCoachLoading}
          errors={addCoachError}
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
