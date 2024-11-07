/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
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
import { useGetFuelCompanyAllListQuery } from "@/store/api/superviosr/fuelCompanyApi";
import { useGetTodaysCoachConfigListQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import {
  useGetSingleSupervisorExpenseQuery,
  useUpdateSupervisorExpenseMutation,
} from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { useGetSupervisorExpenseCategoriesQuery } from "@/store/api/superviosr/supervisorExpenseCategoryApi";
import { UploadIcon } from "lucide-react";

interface IUpdateExpenseProps {
  id: number;
  setOpen: (open: boolean) => void;
}
//@ts-ignore
const UpdateExpense: FC<IUpdateExpenseProps> = ({ id, setOpen }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const user = useSelector((state: any) => state.user);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { data: fuelCompanyListData, isLoading: loadingFuelCompanies } =
    useGetFuelCompanyAllListQuery({});

  const { data: coachConfigs, isLoading: coachConfigLoading } =
    useGetTodaysCoachConfigListQuery({});
  const { data: expenseData, isLoading: loadingExpenseData } =
    useGetSingleSupervisorExpenseQuery(id);
  const [updateExpense, { isLoading: updatingExpense, error: errorUpdate }] =
    useUpdateSupervisorExpenseMutation();

  const { data: expenseCategoriesData, isLoading: loadingCategories } =
    useGetSupervisorExpenseCategoriesQuery({});

  const { handleSubmit, setValue, register, watch } =
    useForm<SupervisorExpenseData>({
      resolver: zodResolver(supervisorExpenseSchema),
      defaultValues: expenseData?.data,
    });

  const expenseType = watch("expenseType");

  useEffect(() => {
    if (expenseData?.data) {
      const expense = expenseData.data;
      setValue("coachConfigId", expense.coachConfigId);
      setValue("fuelCompanyId", expense.fuelCompanyId);
      setValue("expenseCategoryId", expense.expenseCategoryId);
      setValue("routeDirection", expense.routeDirection);
      setValue("expenseType", expense.expenseType);
      setValue("amount", expense.amount);
      setValue("paidAmount", expense.paidAmount);
      //setValue("dueAmount", expense.dueAmount);
      setValue("file", expense.file);
      const parsedDate = parseISO(expense.date);
      setSelectedDate(parsedDate);
      setValue("date", format(parsedDate, "yyyy-MM-dd"));
      setFileUrl(expense.file);
    }
  }, [expenseData, setValue]);

  const handleExpenseTypeChange = (value: "Fuel" | "Others") => {
    setValue("expenseType", value);
  };

  const handleRouteDirectionChange = (value: "Up_Way" | "Down_Way") => {
    setValue("routeDirection", value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      const uploadedUrl = URL.createObjectURL(uploadedFile);
      setFileUrl(uploadedUrl);
      setValue("file", uploadedUrl);
    }
  };

  const onSubmit = async (data: SupervisorExpenseData) => {
    try {
      const updatedData = {
        ...data,
        supervisorId: user?.id,
        date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        file: fileUrl,
      };

      await updateExpense({ id, data: updatedData }).unwrap();
      toast({
        title: translate(
          "খরচ সফলভাবে আপডেট হয়েছে",
          "Expense updated successfully"
        ),
        description: translate(
          "আপনার খরচ সফলভাবে আপডেট হয়েছে",
          "The expense was updated successfully."
        ),
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: translate("আপডেট করতে ত্রুটি", "Error updating expense"),
        description: translate(
          "অনুগ্রহ করে আবার চেষ্টা করুন",
          "Please try again."
        ),
      });
    }
  };
  if (
    loadingExpenseData ||
    coachConfigLoading ||
    loadingFuelCompanies ||
    loadingCategories
  ) {
    return <FormSkeleton columns={3} inputs={17} />;
  }

  return (
    <DialogContent>
      <FormWrapper
        heading={translate("খরচ আপডেট করুন", "Update Expense")}
        subHeading={translate(
          "খরচ আপডেট করতে নিচের তথ্য পূরণ করুন।",
          "Fill out the details below to update the expense."
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {/* Coach Config */}
            <InputWrapper label={translate("কোচ কনফিগ", "Coach Config")}>
              <Select
                onValueChange={(value: any) =>
                  setValue("coachConfigId", parseInt(value))
                }
                defaultValue={String(expenseData?.data.coachConfigId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Coach Config" />
                </SelectTrigger>
                <SelectContent>
                  {coachConfigs?.data.map((config: any) => (
                    <SelectItem key={config.id} value={String(config.id)}>
                      {config.coachNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Expense Type */}
            <InputWrapper
              label={translate("খরচ নির্বাচন করুন", "Select Expense Type")}
            >
              <Select
                onValueChange={handleExpenseTypeChange}
                defaultValue={expenseData?.data.expenseType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Expense Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Fuel Company */}
            <InputWrapper
              label={translate("জ্বালানী কোম্পানি", "Fuel Company")}
            >
              <Select
                onValueChange={(value: any) =>
                  setValue("fuelCompanyId", parseInt(value))
                }
                defaultValue={String(expenseData?.data.fuelCompanyId)}
                disabled={expenseType !== "Fuel"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fuel Company" />
                </SelectTrigger>
                <SelectContent>
                  {fuelCompanyListData?.data.map((company: any) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>
            {/* select route */}
            <InputWrapper
              label={translate("রুট নির্বাচন করুন", "Select Route")}
            >
              <Select
                defaultValue={expenseData?.data.routeDirection}
                onValueChange={handleRouteDirectionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Up_Way">Up Way</SelectItem>
                  <SelectItem value="Down_Way">Down Way</SelectItem>
                </SelectContent>
              </Select>
            </InputWrapper>
            {/* Expense Category */}
            <InputWrapper label={translate("খরচ বিভাগ", "Expense Category")}>
              <Select
                onValueChange={(value: any) =>
                  setValue("expenseCategoryId", parseInt(value))
                }
                defaultValue={String(expenseData?.data.expenseCategoryId)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Expense Category" />
                </SelectTrigger>

                <SelectContent>
                  {expenseCategoriesData?.data.map((company: any) => (
                    <SelectItem key={company.id} value={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputWrapper>

            {/* Other Fields */}
            <InputWrapper label={translate("টাকার পরিমাণ", "Amount")}>
              <Input {...register("amount", { valueAsNumber: true })} />
            </InputWrapper>

            <InputWrapper label={translate("পরিশোধিত", "Paid Amount")}>
              <Input {...register("paidAmount", { valueAsNumber: true })} />
            </InputWrapper>

            {/* Date */}
            <InputWrapper label={translate("তারিখ", "Date")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon />
                    {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    //@ts-ignore
                    selected={selectedDate}
                    //@ts-ignore
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </InputWrapper>

            <InputWrapper label={translate("ফাইল আপলোড করুন", "Upload File")}>
              <Button asChild variant="outline">
                <label>
                  <UploadIcon />
                  <input type="file" hidden onChange={handleFileChange} />
                </label>
              </Button>
            </InputWrapper>
          </div>

          <Submit
            loading={updatingExpense}
            submitTitle={translate("আপডেট করুন", "Update")}
            errors={errorUpdate}
            errorTitle={translate(" যোগ করতে ত্রুটি", "Add Expense Error")}
          />
        </form>
      </FormWrapper>
    </DialogContent>
  );
};

export default UpdateExpense;
