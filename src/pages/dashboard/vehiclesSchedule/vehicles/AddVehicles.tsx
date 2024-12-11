import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
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
import { useUploadPhotoMutation } from "@/store/api/fileApi";
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
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddUpdateVehicleDataProps>({
    resolver: zodResolver(addUpdateVehicleSchema),
  });

  const [selectedDates, setSelectedDates] = useState<{
    deliveryDate: Date | null;
    orderDate: Date | null;
    registrationDate: Date | null;
    fitnessDate: Date | null;
    routePermitDate: Date | null;
    taxTokenDate: Date | null;
  }>({
    deliveryDate: null,
    orderDate: null,
    registrationDate: null,
    fitnessDate: null,
    routePermitDate: null,
    taxTokenDate: null,
  });

  const [calendarOpen, setCalendarOpen] = useState<{
    deliveryDate: boolean;
    orderDate: boolean;
    registrationDate: boolean;
    fitnessDate: boolean;
    routePermitDate: boolean;
    taxTokenDate: boolean;
  }>({
    deliveryDate: false,
    orderDate: false,
    registrationDate: false,
    fitnessDate: false,
    routePermitDate: false,
    taxTokenDate: false,
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
    try {
      // Step 1: Upload Photos and Store URLs
      const photoUploads = [
        { field: "registrationFile", value: data.registrationFile },
        { field: "fitnessCertificate", value: data.fitnessCertificate },
        { field: "taxToken", value: data.taxToken },
        { field: "routePermit", value: data.routePermit },
      ];

      const uploadedFiles: Record<string, string> = {};

      for (const photo of photoUploads) {
        if (photo.value) {
          const result = await uploadPhoto(photo.value).unwrap();
          uploadedFiles[photo.field] = result.data; // Store the URL returned by the API
        }
      }

      // Step 2: Combine Uploaded File URLs with Other Data
      const cleanedData = {
        ...removeFalsyProperties(data, [
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
        ]),
        ...uploadedFiles, // Add uploaded file URLs
      };

      // Step 3: Submit Data to Backend
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
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "ছবি আপলোড করতে বা তথ্য জমা দিতে ব্যর্থ হয়েছে।",
          "Failed to upload photos or submit data."
        ),
      });
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
        className="grid grid-cols-2 gap-4 items-center justify-items-center"
      >
        {/* Registration Number */}
        <InputWrapper
          className="col-span-2"
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
        {/* rgistraiton date */}

        <InputWrapper
          label={translate(
            "নিবন্ধনের মেয়াদ তারিখ*",
            "Registration expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.registrationDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, registrationDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.registrationDate
                  ? format(selectedDates.registrationDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.registrationDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("registrationDate", date || new Date())
                }
                fromYear={1960}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* photo registrationFile uplaod */}
        <InputWrapper
          error={errors?.registrationFile?.message}
          labelFor="registrationFile"
          label={translate("রেজিস্ট্রেশন ফাইল ✼", "Registration File ✼")}
        >
          <PhotoCropper
            id="registrationFile"
            photo={watch("registrationFile") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("registrationFile", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>
        {/* Fitness expire date */}
        <InputWrapper
          label={translate("ফিটনেস মেয়াদ তারিখ*", "Fitness expiry date*")}
        >
          <Popover
            open={calendarOpen.fitnessDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, fitnessDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.fitnessDate
                  ? format(selectedDates.fitnessDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.fitnessDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("fitnessDate", date || new Date())
                }
                fromYear={1960}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Fitness Certificate */}
        <InputWrapper
          error={errors?.fitnessCertificate?.message}
          labelFor="fitnessCertificate"
          label={translate("ফিটনেস সার্টিফিকেট ✼", "Fitness Certificate ✼")}
        >
          <PhotoCropper
            photo={watch("fitnessCertificate") || undefined}
            id="fitnessCertificate"
            setPhoto={(value: string | undefined) => {
              setValue("fitnessCertificate", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>
        {/* tax token expire date */}

        <InputWrapper
          label={translate(
            "ট্যাক্স টোকেন মেয়াদ তারিখ*",
            "Tax Token expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.taxTokenDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, taxTokenDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.taxTokenDate
                  ? format(selectedDates.taxTokenDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.taxTokenDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("taxTokenDate", date || new Date())
                }
                fromYear={1960}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Tax Token */}
        <InputWrapper
          error={errors?.taxToken?.message}
          labelFor="taxToken"
          label={translate("ট্যাক্স টোকেন ✼", "Tax Token ✼")}
        >
          <PhotoCropper
            id="taxToken"
            photo={watch("taxToken") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("taxToken", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>
        {/* ROute permit expire date */}
        <InputWrapper
          label={translate(
            "রুট পারমিট মেয়াদ তারিখ*",
            "Route Permit expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.routePermitDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, routePermitDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.routePermitDate
                  ? format(selectedDates.routePermitDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.routePermitDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("routePermitDate", date || new Date())
                }
                fromYear={1960}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Route Permit */}
        <InputWrapper
          error={errors?.routePermit?.message}
          labelFor="routePermit"
          label={translate("রুট পারমিট ✼", "Route Permit ✼")}
        >
          <PhotoCropper
            id="routePermit"
            photo={watch("routePermit") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("routePermit", value || ""); // Ensure the value is a string
            }}
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
          loading={addVehicleLoading || uploadPhotoLoading}
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
