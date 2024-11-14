/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogContent } from "@/components/ui/dialog";
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
  SupervisorExpenseData,
  supervisorExpenseSchema,
} from "@/schemas/supervisor/supervisorExpenseSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useCreateSupervisorExpenseMutation } from "@/store/api/superviosr/supervisorExpenseApi";
import { useGetSupervisorExpenseCategoriesQuery } from "@/store/api/superviosr/supervisorExpenseCategoryApi";

import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import { useGetFuelCompanyAllListQuery } from "@/store/api/superviosr/fuelCompanyApi";
import { useGetTodaysCoachConfigListQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, UploadIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface IAddExpenseProps {
  setOpen: (open: boolean) => void;
}

const AddExpense: FC<IAddExpenseProps> = ({ setOpen }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  //const { toastMessage } = useMessageGenerator();
  //@ts-ignore
  const [uploadPhoto, { uploadPhotoLoading }] = useUploadPhotoMutation();
  const [createSupervisorExpense, { isLoading, error: isExpenceErrorCreate }] =
    useCreateSupervisorExpenseMutation();
  const { data: expenseCategoriesData, isLoading: loadingCategories } =
    useGetSupervisorExpenseCategoriesQuery({});
  //@ts-ignore
  const { data: fuelCompanyListData, isLoading: loadingFuelCOmpany } =
    //@ts-ignore
    useGetFuelCompanyAllListQuery({});
  //@ts-ignore
  const user = useSelector((state: any) => state.user);

  const [date, setDate] = useState<Date | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupervisorExpenseData>({
    resolver: zodResolver(supervisorExpenseSchema),
  });
  const expenseType = watch("expenseType");
  const amount = watch("amount");
  useEffect(() => {
    if (expenseType !== "Fuel") {
      setValue("paidAmount", amount ? amount : 0);
    } else {
      //@ts-ignore
      setValue("paidAmount", "");
    }
  }, [expenseType, setValue, amount]);
  // Sync routeDirection with form value
  const handleRouteDirectionChange = (value: "Up_Way" | "Down_Way") => {
    setValue("routeDirection", value); // Sync with form
  };
  // Sync routeDirection with form value
  const handleExpenseTypeChange = (value: "Fuel" | "Others") => {
    setValue("expenseType", value); // Sync with form
  };

  // Sync date with form value
  useEffect(() => {
    if (date) setValue("date", format(date, "yyyy-MM-dd")); // Sync date
  }, [date, setValue]);

  // Sync file with form value
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValue("file", e.target.files[0].name); // Sync with form
    }
  };

  const { data: coachConfigs, isLoading: coachConfigLoading } =
    useGetTodaysCoachConfigListQuery({});

  const onSubmit = async (data: SupervisorExpenseData) => {
    if (!file) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "Please select a file.",
      });
      return;
    }

    //const formData = new FormData();

    try {
      const uploadResult = await uploadPhoto(file).unwrap();
      //
      if (uploadResult?.data) {
        const expenseData = {
          ...data,
          date: new Date(data.date),
          dueAmount: data.amount - data.paidAmount,
          supervisorId: user?.id,
          file: uploadResult.data, // Set uploaded file URL
        };

        const result = await createSupervisorExpense(expenseData).unwrap();

        if (result?.success) {
          toast({
            title: "খরচ সফলভাবে যোগ করা হয়েছে",
            description: "Expense added successfully.",
          });
          playSound("add");
          setOpen(false); // Close the form
        }
      }
    } catch (error) {
      toast({
        title: "ত্রুটি ঘটেছে",
        description: "An error occurred. Please try again.",
      });
    }
  };

  if (coachConfigLoading || loadingFuelCOmpany) {
    return <FormSkeleton columns={3} inputs={17} />;
  }

  return (
    <DialogContent>
      <FormWrapper
        heading={translate("খরচ যোগ করুন", "Add Expense")}
        subHeading={translate(
          "নতুন সংগ্রহ যোগ করতে নিচের তথ্য পূরণ করুন।",
          "Fill in the details below to add a new collection."
        )}
      >
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Coach Config ID */}
            <InputWrapper
              labelFor="coachConfigId"
              error={errors.coachConfigId?.message}
              label={translate("কোচ কনফিগ", "Coach Config")}
            >
              <Select
                onValueChange={(value) =>
                  setValue("coachConfigId", parseInt(value))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "কোচ কনফিগ নির্বাচন করুন",
                      "Select Coach Config"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!coachConfigLoading &&
                    coachConfigs?.data?.map((config: any) => (
                      <SelectItem key={config.id} value={config.id.toString()}>
                        {config.coachNo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Expense type Direction */}
            <InputWrapper
              label={translate("খরচ নির্বাচন করুন", "Select Expense Type")}
            >
              <Select onValueChange={handleExpenseTypeChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={translate(
                      "খরচ নির্বাচন করুন",
                      "Select Expense Type"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>
            {/* fuel company id */}
            {/* Fuel Company (Conditional) */}
            {expenseType === "Fuel" && (
              <>
                <InputWrapper
                  label={translate(
                    "জ্বালানী কোম্পানি নির্বাচন করুন",
                    "Select Fuel Company"
                  )}
                  //@ts-ignore
                  error={
                    expenseType === "Fuel" && errors.fuelCompanyId?.message
                  }
                >
                  <Select
                    onValueChange={(value) =>
                      setValue("fuelCompanyId", parseInt(value))
                    }
                    disabled={expenseType !== "Fuel"} // Disable if not Fuel
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={translate(
                          "জ্বালানী কোম্পানি নির্বাচন করুন",
                          "Select Fuel Company"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelCompanyListData?.data.map((company: any) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputWrapper>

                {/*fule weight*/}
                <InputWrapper label={translate("জ্বালানী ওজন", "Fuel Weight")}>
                  <Input
                    {...register("fuelWeight", { valueAsNumber: true })}
                    placeholder={translate("জ্বালানী ওজন", "Fuel Weight")}
                  />
                </InputWrapper>
                {/*fule fuelPrice*/}
                <InputWrapper label={translate("জ্বালানী মূল্য", "Fuel Price")}>
                  <Input
                    {...register("fuelPrice", { valueAsNumber: true })}
                    placeholder={translate("জ্বালানী মূল্য", "Fuel Price")}
                  />
                </InputWrapper>
              </>
            )}

            {/* Expense Category */}
            <InputWrapper
              label={translate(
                "খরচ বিভাগ নির্বাচন করুন",
                "Select Expense Category"
              )}
            >
              <Select
                onValueChange={(value: any) =>
                  setValue("expenseCategoryId", Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={translate(
                      "খরচ বিভাগ নির্বাচন করুন",
                      "Select Expense Category"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingCategories ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    expenseCategoriesData?.data.map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Route Direction */}
            <InputWrapper
              label={translate("রুট নির্বাচন করুন", "Select Route")}
            >
              <Select onValueChange={handleRouteDirectionChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={translate("রুট নির্বাচন করুন", "Select Route")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Up_Way">Up Way</SelectItem>
                  <SelectItem value="Down_Way">Down Way</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Amount */}
            <InputWrapper label={translate("পরিমাণ", "Amount")}>
              <Input
                {...register("amount", { valueAsNumber: true })}
                placeholder={translate("পরিমাণ", "Amount")}
              />
            </InputWrapper>
            {/* Paid Amount */}
            <InputWrapper label={translate("পরিশোধিত পরিমাণ", "Paid Amount")}>
              <Input
                {...register("paidAmount", { valueAsNumber: true })}
                placeholder={translate("পরিশোধিত পরিমাণ", "Paid Amount")}
                disabled={expenseType !== "Fuel"}
              />
            </InputWrapper>
            {/* DUeAmount 
            <InputWrapper label={translate("বকেয়া পরিমাণ", "Due Amount")}>
              <Input
                {...register("dueAmount", { valueAsNumber: true })}
                placeholder={translate("বকেয়া পরিমাণ", "Due Amount")}
              />
            </InputWrapper>
*/}
            {/* Date Picker */}
            <InputWrapper
              label={translate("তারিখ নির্বাচন করুন", "Select Date")}
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2" />
                    {date
                      ? format(date, "PPP")
                      : translate("তারিখ নির্বাচন করুন", "Select Date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    //@ts-ignore
                    mode="single"
                    //@ts-ignore
                    selected={date}
                    //@ts-ignore
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>

            {/* File Upload */}
            <InputWrapper
              label={translate("ফাইল নির্বাচন করুন", "Select File")}
            >
              <Button asChild variant="outline" className="w-full">
                <label htmlFor="file-upload" className="flex items-center">
                  <UploadIcon className="mr-2" />
                  {file
                    ? file.name
                    : translate("ফাইল নির্বাচন করুন", "Select File")}
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>
              </Button>
            </InputWrapper>
          </div>
          <Submit
            loading={isLoading || uploadPhotoLoading}
            errors={isExpenceErrorCreate}
            submitTitle={translate(" যুক্ত করুন", "Add Expense")}
            errorTitle={translate(" যোগ করতে ত্রুটি", "Add Expense Error")}
          />
        </form>
      </FormWrapper>
    </DialogContent>
  );
};

export default AddExpense;
