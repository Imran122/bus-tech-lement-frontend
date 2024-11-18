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
import {
  useGetSupervisorUpDownDetailsQuery,
  useSubmitSupervisorExpenseReportMutation,
} from "@/store/api/superviosr/supervisorExpenseApi";
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

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [fetchData, setFetchData] = useState(false);

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

  const handleDateChange = (
    selectedDate: Date | null,
    type: "upDate" | "downDate"
  ) => {
    if (selectedDate) {
      setDateRange((prev) => ({
        ...prev,
        [type]: selectedDate,
        [`${type}CalendarOpen`]: false,
      }));

      if (type === "upDate") {
        localStorage.setItem("upDate", format(selectedDate, "yyyy-MM-dd"));
      } else if (type === "downDate") {
        localStorage.setItem("downDate", format(selectedDate, "yyyy-MM-dd"));
      }

      setFetchData(true);
    }
  };

  const resetDates = () => {
    localStorage.removeItem("upDate");
    localStorage.removeItem("downDate");
    setDateRange({
      upDate: null,
      downDate: null,
      upCalendarOpen: false,
      downCalendarOpen: false,
    });
    setFetchData(false);
    setAlreadySubmitted(false);
    toast({
      title: "Reset",
      description: "Dates have been cleared from local storage.",
    });
  };

  useEffect(() => {
    const storedUpDate = localStorage.getItem("upDate");
    const storedDownDate = localStorage.getItem("downDate");

    if (storedUpDate && storedDownDate) {
      setDateRange((prev) => ({
        ...prev,
        upDate: new Date(storedUpDate),
        downDate: new Date(storedDownDate),
      }));
      setFetchData(true);
    }
  }, []);

  useEffect(() => {
    const checkAlreadySubmitted = () => {
      const savedSubmissionData = JSON.parse(
        localStorage.getItem("submissionData") || "{}"
      );
      if (
        dateRange.upDate &&
        dateRange.downDate &&
        savedSubmissionData.upWayDate ===
          format(dateRange.upDate, "yyyy-MM-dd") &&
        savedSubmissionData.downWayDate ===
          format(dateRange.downDate, "yyyy-MM-dd")
      ) {
        setAlreadySubmitted(true);
      } else {
        setAlreadySubmitted(false);
      }
    };

    checkAlreadySubmitted();
  }, [dateRange.upDate, dateRange.downDate]);
  const [submitSupervisorExpenseReport, { isLoading: submitReportLoading }] =
    useSubmitSupervisorExpenseReportMutation();

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

  const handleSubmit = async () => {
    const mainData = {
      supervisorId: user?.id,
      upWayCoachConfigId: coachDetailsData?.data?.upWayCoachConfigId,
      downWayCoachConfigId: coachDetailsData?.data?.downWayCoachConfigId,
      upWayDate: coachDetailsData?.data?.upDate,
      downWayDate: coachDetailsData?.data?.downDate, // Include downWayDate
      cashOnHand: chasOnHand,
    };

    try {
      const result = await submitSupervisorExpenseReport(mainData).unwrap();

      if (result.success) {
        // Store upWayDate and downWayDate in local storage
        localStorage.setItem(
          "submissionData",
          JSON.stringify({
            upWayCoachConfigId: coachDetailsData?.data?.upWayCoachConfigId,
            downWayCoachConfigId: coachDetailsData?.data?.downWayCoachConfigId,
            upWayDate: coachDetailsData?.data?.upDate,
            downWayDate: coachDetailsData?.data?.downDate, // Store downWayDate
            cashOnHand: chasOnHand,
          })
        );

        toast({
          title: "Success",
          description: "Submission successful!",
        });

        setAlreadySubmitted(true); // Disable the submit button
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Submission failed. Please try again.",
      });
    }
  };

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

  if (coachDetailsLoading) {
    return <TableSkeleton columns={10} />;
  }

  return (
    <PageWrapper>
      <div className="flex justify-between items-center py-5">
        <h2 className="font-bold text-2xl">
          {translate("কোচ তথ্য উপাত্ত", "Coach Information Data")}
        </h2>
      </div>

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
              selected={dateRange.upDate || undefined}
              onSelect={(selectedDate: Date | undefined) => {
                if (selectedDate) {
                  handleDateChange(selectedDate, "upDate");
                }
              }}
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
              selected={dateRange.downDate || undefined}
              onSelect={(selectedDate: Date | undefined) => {
                if (selectedDate) {
                  handleDateChange(selectedDate, "downDate");
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <Button variant="primary" onClick={resetDates}>
          Reset
        </Button>
      </div>

      <ReportTable
        mainHeaders={["upIncome", "downIncome", "expense"]}
        subHeaders={[
          ["Counter Name", "Taka"],
          ["Counter Name", "Taka"],
          ["Expense Name", "Taka"],
        ]}
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
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">
                    Today's Up Opening Balance
                  </td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalUpOpeningBalance || 0.0}
                  </td>{" "}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">
                    Today's Down Opening Balance
                  </td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalDownOpeningBalance || 0.0}
                  </td>{" "}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">Expense</td>
                  <td className="border-primary/50  px-4 py-2">
                    {coachDetailsData?.data?.totalExpense || 0.0}
                  </td>{" "}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">Other Income</td>
                  <td className="border-primary/50  px-4 py-2">
                    {totalOtherIncome || 0}
                  </td>{" "}
                </tr>
                <tr>
                  <td className="border-primary/50  px-4 py-2">Cash On Hand</td>
                  <td className="border-primary/50  px-4 py-2">
                    {chasOnHand || 0}
                  </td>{" "}
                </tr>
              </tbody>
            </table>

            {!alreadySubmitted && (
              <Button
                className="px-10 py-3 bg-primary mt-5 rounded-sm"
                onClick={handleSubmit}
                disabled={submitReportLoading}
              >
                {submitReportLoading ? "Submitting..." : "Submit"}
              </Button>
            )}
          </PageTransition>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SupervisorReport;
