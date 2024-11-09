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
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateVehicleDataProps,
  addUpdateVehicleSchema,
} from "@/schemas/vehiclesSchedule/addUpdateVehicleSchema";
import {
  useGetSingleVehicleQuery,
  useUpdateVehicleMutation,
} from "@/store/api/vehiclesSchedule/vehicleApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateVehicleProps {
  id: number;
}

const UpdateVehicle: FC<IUpdateVehicleProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [
    updateVehicle,
    { isLoading: updateVehicleLoading, error: updateVehicleError },
  ] = useUpdateVehicleMutation();

  const { data: vehicleData, isLoading: vehicleLoading } =
    useGetSingleVehicleQuery(id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddUpdateVehicleDataProps>({
    resolver: zodResolver(addUpdateVehicleSchema),
  });

  const [selectedDates, setSelectedDates] = useState<{
    deliveryDate: Date | null;
    orderDate: Date | null;
  }>({
    deliveryDate: null,
    orderDate: null,
  });

  const [calendarOpen, setCalendarOpen] = useState<{
    deliveryDate: boolean;
    orderDate: boolean;
  }>({
    deliveryDate: false,
    orderDate: false,
  });

  useEffect(() => {
    if (vehicleData?.data) {
      const {
        registrationNo,
        manufacturerCompany,
        model,
        chasisNo,
        engineNo,
        countryOfOrigin,
        lcCode,
        color,
        deliveryToDipo,
        deliveryDate,
        orderDate,
      } = vehicleData.data;

      setValue("registrationNo", registrationNo);
      setValue("manufacturerCompany", manufacturerCompany);
      setValue("model", model);
      setValue("chasisNo", chasisNo);
      setValue("engineNo", engineNo);
      setValue("countryOfOrigin", countryOfOrigin);
      setValue("lcCode", lcCode);
      setValue("color", color);
      setValue("deliveryToDipo", deliveryToDipo);
      setSelectedDates({
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        orderDate: orderDate ? new Date(orderDate) : null,
      });
    }
  }, [vehicleData, setValue]);

  const handleDateChange = (
    field: keyof typeof selectedDates,
    date: Date | null
  ) => {
    setSelectedDates((prev) => ({ ...prev, [field]: date }));
    setValue(field, date ? format(date, "yyyy-MM-dd") : undefined);
    setCalendarOpen((prev) => ({ ...prev, [field]: false }));
  };

  const onSubmit = async (data: AddUpdateVehicleDataProps) => {
    const result = await updateVehicle({ id, data });
    if (result?.data?.success) {
      toast({
        title: translate(
          "যানবাহন সফলভাবে আপডেট হয়েছে",
          "Vehicle updated successfully"
        ),
        description: toastMessage("update", translate("যানবাহন", "vehicle")),
      });
    }
  };

  if (vehicleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormWrapper
      heading={translate("যানবাহন আপডেট করুন", "Update Vehicle")}
      subHeading={translate(
        "যানবাহনের বিবরণ আপডেট করুন",
        "Update the details of the vehicle."
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4"
      >
        {/* Registration Number */}
        <InputWrapper
          error={errors?.registrationNo?.message}
          labelFor="registrationNo"
          label={translate("রেজিস্ট্রেশন নম্বর", "Registration Number")}
        >
          <Input
            id="registrationNo"
            type="text"
            {...register("registrationNo")}
            placeholder={translate(
              "রেজিস্ট্রেশন নম্বর লিখুন",
              "Enter registration number"
            )}
          />
        </InputWrapper>

        {/* Manufacturer Company */}
        <InputWrapper
          error={errors?.manufacturerCompany?.message}
          labelFor="manufacturerCompany"
          label={translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company")}
        >
          <Input
            id="manufacturerCompany"
            type="text"
            {...register("manufacturerCompany")}
            placeholder={translate(
              "প্রস্তুতকারক কোম্পানি লিখুন",
              "Enter manufacturer company"
            )}
          />
        </InputWrapper>

        {/* Model */}
        <InputWrapper
          error={errors.model?.message}
          labelFor="model"
          label={translate("মডেল", "Model")}
        >
          <Input
            id="model"
            type="text"
            {...register("model")}
            placeholder={translate("মডেল লিখুন", "Enter model")}
          />
        </InputWrapper>

        {/* Chassis Number */}
        <InputWrapper
          error={errors.chasisNo?.message}
          labelFor="chasisNo"
          label={translate("চেসিস নম্বর", "Chassis Number")}
        >
          <Input
            id="chasisNo"
            type="text"
            {...register("chasisNo")}
            placeholder={translate("চেসিস নম্বর লিখুন", "Enter chassis number")}
          />
        </InputWrapper>

        {/* Engine Number */}
        <InputWrapper
          error={errors.engineNo?.message}
          labelFor="engineNo"
          label={translate("ইঞ্জিন নম্বর", "Engine Number")}
        >
          <Input
            id="engineNo"
            type="text"
            {...register("engineNo")}
            placeholder={translate("ইঞ্জিন নম্বর লিখুন", "Enter engine number")}
          />
        </InputWrapper>

        {/* Country of Origin */}
        <InputWrapper
          error={errors.countryOfOrigin?.message}
          labelFor="countryOfOrigin"
          label={translate("উৎপত্তির দেশ", "Country of Origin")}
        >
          <Input
            id="countryOfOrigin"
            type="text"
            {...register("countryOfOrigin")}
            placeholder={translate(
              "উৎপত্তির দেশ লিখুন",
              "Enter country of origin"
            )}
          />
        </InputWrapper>

        {/* LC Code */}
        <InputWrapper
          error={errors.lcCode?.message}
          labelFor="lcCode"
          label={translate("এলসি কোড", "LC Code")}
        >
          <Input
            id="lcCode"
            type="text"
            {...register("lcCode")}
            placeholder={translate("এলসি কোড লিখুন", "Enter LC code")}
          />
        </InputWrapper>

        {/* Color */}
        <InputWrapper
          error={errors.color?.message}
          labelFor="color"
          label={translate("রং", "Color")}
        >
          <Input
            id="color"
            type="text"
            {...register("color")}
            placeholder={translate("রং লিখুন", "Enter color")}
          />
        </InputWrapper>

        {/* Delivery to Depot */}
        <InputWrapper
          error={errors.deliveryToDipo?.message}
          labelFor="deliveryToDipo"
          label={translate("ডিপোতে ডেলিভারি", "Delivery to Depot")}
        >
          <Input
            id="deliveryToDipo"
            type="text"
            {...register("deliveryToDipo")}
            placeholder={translate(
              "ডিপোতে ডেলিভারি লিখুন",
              "Enter delivery to depot"
            )}
          />
        </InputWrapper>

        {/* Delivery Date */}
        {/* Delivery Date */}
        <InputWrapper label={translate("ডেলিভারি তারিখ", "Delivery Date")}>
          <Popover
            open={calendarOpen.deliveryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, deliveryDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.deliveryDate
                  ? format(selectedDates.deliveryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.deliveryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("deliveryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1960}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        {/* Order Date */}
        <InputWrapper label={translate("অর্ডার তারিখ", "Order Date")}>
          <Popover
            open={calendarOpen.orderDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, orderDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.orderDate
                  ? format(selectedDates.orderDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.orderDate || new Date()}
                onSelect={(date) => handleDateChange("orderDate", date ?? null)} // Fallback to null if date is undefined
                fromYear={1960}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        <Submit
          loading={updateVehicleLoading}
          errors={updateVehicleError}
          submitTitle={translate("আপডেট যানবাহন", "Update Vehicle")}
          errorTitle={translate(
            "যানবাহন আপডেট করতে ত্রুটি",
            "Error updating vehicle"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateVehicle;
