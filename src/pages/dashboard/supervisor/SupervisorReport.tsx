import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import ReportTable from "@/components/common/table/ReportTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { useGetSupervisorUpDownDetailsQuery } from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SupervisorReport: React.FC = () => {
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);
  const { toast } = useToast();

  //const { toastMessage } = useMessageGenerator();
  const [dateRange, setDateRange] = useState<{
    upDate: Date | null;
    downDate: Date | null;
    upCalendarOpen: boolean;
    downCalendarOpen: boolean;
  }>({
    upDate: null,
    downDate: null,
    upCalendarOpen: false,
    downCalendarOpen: false,
  });

  const [fetchData, setFetchData] = useState(false);

  const handleDateChange = (selectedDate: any, type: any) => {
    setDateRange((prev: any) => ({
      ...prev,
      [type]: selectedDate,
      [`${type}CalendarOpen`]: false,
    }));
  };

  const { data: coachDetailsData, isLoading: coachDetailsLoading } =
    useGetSupervisorUpDownDetailsQuery(
      fetchData && dateRange.upDate && dateRange.downDate
        ? {
            upDate: format(dateRange.upDate, "yyyy-MM-dd"),
            downDate: format(dateRange.downDate, "yyyy-MM-dd"),
            supervisorId: user.id,
          }
        : skipToken
    );

  useEffect(() => {
    if (dateRange.upDate && dateRange.downDate) {
      setFetchData(true);
    }
  }, [dateRange.upDate, dateRange.downDate]);
  // Clear local storage if selected dates match stored dates
  const handleSubmit = () => {
    const savedUpDate = localStorage.getItem("upDate");
    const savedDownDate = localStorage.getItem("downDate");

    const selectedUpDate = dateRange.upDate
      ? format(dateRange.upDate, "yyyy-MM-dd")
      : "";
    const selectedDownDate = dateRange.downDate
      ? format(dateRange.downDate, "yyyy-MM-dd")
      : "";

    // Check if the dates match before clearing local storage
    if (savedUpDate === selectedUpDate && savedDownDate === selectedDownDate) {
      localStorage.removeItem("upDate");
      localStorage.removeItem("downDate");

      toast({
        title: "Success",
        description:
          "The dates were submitted, and local storage has been cleared.",
      });
    } else {
      toast({
        title: "Error",
        description: "Selected dates do not match the stored dates.",
      });
    }
  };
  const mainHeaders = ["upIncome", "downIncome", "expense"];
  const subHeaders = [
    ["Counter Name", "Taka"],
    ["Counter Name", "Taka"],
    ["Expense Name", "Taka"],
  ];

  // Flatten data to create rows for each item in upIncome, downIncome, and expense
  const reportData = coachDetailsData
    ? [
        ...coachDetailsData.data.upWayCollectionReport.map((upItem: any) => ({
          upIncome: {
            "Counter Name": upItem.counterName,
            Taka: upItem.amount,
          },
          downIncome: { "Counter Name": "-", Taka: "-" },
          expense: { "Expense Name": "-", Taka: "-" },
        })),
        ...coachDetailsData.data.downWayCollectionReport.map(
          (downItem: any) => ({
            upIncome: { "Counter Name": "-", Taka: "-" },
            downIncome: {
              "Counter Name": downItem.counterName,
              Taka: downItem.amount,
            },
            expense: { "Expense Name": "-", Taka: "-" },
          })
        ),
        ...coachDetailsData.data.expenseReport.map((expenseItem: any) => ({
          upIncome: { "Counter Name": "-", Taka: "-" },
          downIncome: { "Counter Name": "-", Taka: "-" },
          expense: {
            "Expense Name": expenseItem.expenseCategory,
            Taka: expenseItem.amount,
          },
        })),
      ]
    : [];

  //@ts-ignore
  const upDownTotal =
    coachDetailsData?.data?.totalDownIncome +
    coachDetailsData?.data?.totalUpIncome;
  //@ts-ignore
  const totalOtherIncome =
    coachDetailsData?.data?.othersIncomeDownWay +
    coachDetailsData?.data?.othersIncomeUpWay;
  //@ts-ignore
  const chasOnHand =
    upDownTotal +
    coachDetailsData?.data?.totalDownOpeningBalance +
    coachDetailsData?.data?.totalUpOpeningBalance +
    coachDetailsData?.data?.othersIncomeDownWay +
    coachDetailsData?.data?.othersIncomeUpWay -
    coachDetailsData?.data?.totalExpense;

  if (coachDetailsLoading) {
    return <TableSkeleton columns={10} />;
  }

  return (
    <PageWrapper>
      <h2 className="font-bold text-2xl py-5">
        {translate("কোচ তথ্য উপাত্ত", "Coach Information Data")}
      </h2>

      <div className="flex space-x-4 mb-6">
        <Popover
          open={dateRange.upCalendarOpen}
          onOpenChange={(open) =>
            setDateRange((prev) => ({ ...prev, upCalendarOpen: open }))
          }
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.upDate
                ? format(dateRange.upDate, "PPP")
                : translate("শুরু তারিখ নির্বাচন করুন", "Select Start Date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <Calendar
              mode="single"
              selected={dateRange.upDate || new Date()}
              onSelect={(date: any) => handleDateChange(date, "upDate")}
              fromYear={1960}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>

        <Popover
          open={dateRange.downCalendarOpen}
          onOpenChange={(open) =>
            setDateRange((prev) => ({ ...prev, downCalendarOpen: open }))
          }
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.downDate
                ? format(dateRange.downDate, "PPP")
                : translate("শেষ তারিখ নির্বাচন করুন", "Select End Date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <Calendar
              mode="single"
              selected={dateRange.downDate || new Date()}
              onSelect={(date: any) => handleDateChange(date, "downDate")}
              fromYear={1960}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <ReportTable
        mainHeaders={mainHeaders}
        subHeaders={subHeaders}
        data={reportData}
        bordered
      />
      <div className=" w-7/12 flex justify-end items-end">
        <div className="w-full pt-10  ">
          <PageTransition className="border-2 rounded-md border-primary/50 bg-primary/5 backdrop-blur-[2px] p-4 duration-300">
            <table className="w-full border-collapse border-primary/50 bg-primary/5 backdrop-blur-[2px] text-left text-sm">
              <thead>
                <tr>
                  <th className="border-primary/50 bg-primary/5 backdrop-blur-[2px] px-4 py-2">
                    Description
                  </th>
                  <th className="border-primary/50 bg-primary/5 backdrop-blur-[2px] px-4 py-2">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-primary/50  px-4 py-2">
                    Up & Down Income Subtotal
                  </td>
                  <td className="border-primary/50  px-4 py-2">
                    {upDownTotal ? upDownTotal : 0}
                  </td>{" "}
                  {/* Replace with dynamic subtotal */}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">
                    Today's Up Opening Balance
                  </td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalUpOpeningBalance
                      ? coachDetailsData?.data?.totalUpOpeningBalance
                      : 0.0}
                  </td>{" "}
                  {/* Replace with dynamic subtotal */}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">
                    Today's Down Opening Balance
                  </td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalDownOpeningBalance
                      ? coachDetailsData?.data?.totalDownOpeningBalance
                      : 0.0}
                  </td>{" "}
                  {/* Replace with dynamic subtotal */}
                </tr>

                <tr>
                  <td className="border-primary/50  px-4 py-2">Expense</td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalExpense
                      ? coachDetailsData?.data?.totalExpense
                      : 0.0}
                  </td>{" "}
                  {/* Replace with dynamic total */}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">Other Income</td>
                  <td className="border-primary/50  px-4 py-2">
                    {totalOtherIncome ? totalOtherIncome : 0}
                  </td>{" "}
                  {/* Replace with dynamic total */}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">Cash On Hand</td>
                  <td className="border-primary/50  px-4 py-2">
                    {chasOnHand ? chasOnHand : 0}
                  </td>{" "}
                  {/* Replace with dynamic total */}
                </tr>
              </tbody>
            </table>
            <Button
              className="px-10 py-3 bg-primary mt-5 rounded-sm"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </PageTransition>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SupervisorReport;
