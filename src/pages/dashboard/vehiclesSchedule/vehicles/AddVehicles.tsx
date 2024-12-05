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
import { useAddVehicleMutation } from "@/store/api/vehiclesSchedule/vehicleApi";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IVehicleStateProps } from "./VehiclesList";

interface IAddVehicleProps {
  setVehicleState: (
    vehicleState: (prevState: IVehicleStateProps) => IVehicleStateProps
  ) => void;
}

const AddVehicles: FC<IAddVehicleProps> = ({ setVehicleState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [addVehicle, { isLoading: addVehicleLoading, error: addVehicleError }] =
    useAddVehicleMutation();

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

  const handleDateChange = (
    field: keyof typeof selectedDates,
    date: Date | null
  ) => {
    setSelectedDates((prev) => ({ ...prev, [field]: date }));
    setValue(field, date ? format(date, "yyyy-MM-dd") : undefined);
    setCalendarOpen((prev) => ({ ...prev, [field]: false }));
  };

  const onSubmit = async (data: AddUpdateVehicleDataProps) => {
    const cleanedData = removeFalsyProperties(data, [
      "orderDate",
      "deliveryDate",
      "deliveryToDipo",
      "color",
      "lcCode",
      "countryOfOrigin",
      "engineNo",
      "manufacturerCompany",
      "chasisNo",
      "model",
    ]);
    const result = await addVehicle(cleanedData);
    if (result?.data?.success) {
      toast({
        title: translate(
          "যানবাহন যোগ করার বার্তা",
          "Message for adding vehicle"
        ),
        description: toastMessage("add", translate("যানবাহন", "vehicle")),
      });
      setVehicleState((prevState: IVehicleStateProps) => ({
        ...prevState,
        addVehicleOpen: false, // Close the modal after success
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("যানবাহন যোগ করুন", "Add Vehicle")}
      subHeading={translate(
        "সিস্টেমে নতুন যানবাহন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new vehicle to the system."
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
          label={translate("রেজিস্ট্রেশন নম্বর ✼", "Registration Number ✼")}
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
        <InputWrapper labelFor="model" label={translate("মডেল", "Model")}>
          <Input
            id="model"
            type="text"
            {...register("model")}
            placeholder={translate("মডেল লিখুন", "Enter model")}
          />
        </InputWrapper>

        {/* Chassis Number */}
        <InputWrapper
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
        <InputWrapper labelFor="color" label={translate("রং", "Color")}>
          <Input
            id="color"
            type="text"
            {...register("color")}
            placeholder={translate("রং লিখুন", "Enter color")}
          />
        </InputWrapper>

        {/* Delivery to Depot */}
        <InputWrapper
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
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.deliveryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("deliveryDate", date || new Date())
                }
                captionLayout="dropdown-buttons"
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
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.orderDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("orderDate", date || new Date())
                }
                fromYear={1960}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        <Submit
          loading={addVehicleLoading}
          errors={addVehicleError}
          submitTitle={translate("যানবাহন যুক্ত করুন", "Add Vehicle")}
          errorTitle={translate(
            "যানবাহন যোগ করতে ত্রুটি",
            "Error Adding Vehicle"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddVehicles;
