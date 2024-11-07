// SupervisorDashboardHome.tsx
import PageTransition from "@/components/common/effect/PageTransition";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useGetSupervisorDashboardCoachInfoQuery,
  useGetSupervisorUpDownDetailsQuery,
} from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
interface IReportSuite {}

const SupervisorDashboardHome: FC<IReportSuite> = () => {
  const { translate } = useCustomTranslator();
  const navigate = useNavigate();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
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

  const { data: coachData, isLoading: coachLoading } =
    useGetSupervisorDashboardCoachInfoQuery({
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const user = useSelector((state: any) => state.user);
  const handleDateChange = (
    selectedDate: Date,
    type: "upDate" | "downDate"
  ) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd"); // Ensure consistent format
    setDateRange((prev) => ({
      ...prev,
      [type]: selectedDate,
      [`${type}CalendarOpen`]: false,
    }));
    localStorage.setItem(type, formattedDate); // Store the formatted date
  };

  // Load dates from local storage on component mount
  useEffect(() => {
    const savedUpDate = localStorage.getItem("upDate");
    const savedDownDate = localStorage.getItem("downDate");

    setDateRange({
      upDate: savedUpDate ? new Date(savedUpDate) : null,
      downDate: savedDownDate ? new Date(savedDownDate) : null,
      upCalendarOpen: false,
      downCalendarOpen: false,
    });
  }, []);

  const { data: coachDetailsData, isLoading: coachDetailsLoading } =
    useGetSupervisorUpDownDetailsQuery(
      dateRange.upDate && dateRange.downDate
        ? {
            upDate: format(dateRange.upDate, "yyyy-MM-dd"),
            downDate: format(dateRange.downDate, "yyyy-MM-dd"),
            supervisorId: user.id,
          }
        : skipToken
    );
  console.log("coachDetailsData", coachDetailsData);
  const totalItems = coachData?.data?.length || 0;
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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) =>
        totalItems > 0
          ? (query.page - 1) * query.size + info.row.index + 1
          : null,
    },
    { accessorKey: "coachNo", header: translate("কোচ নম্বর", "Coach Number") },
    {
      accessorKey: "registrationNo",
      header: translate("নিবন্ধন নম্বর", "Registration Number"),
    },
    { accessorKey: "coachType", header: translate("কোচের ধরন", "Coach Type") },
    {
      accessorKey: "seatPlan",
      header: translate("আসন পরিকল্পনা", "Seat Plan"),
    },
    {
      accessorKey: "seatAvailable",
      header: translate("আসন সংখ্যা", "Available Seats"),
    },
    {
      accessorKey: "coachClass",
      header: translate("কোচ শ্রেণী", "Coach Class"),
    },
    { accessorKey: "schedule", header: translate("সময়সূচি", "Schedule") },
    {
      accessorKey: "departureDate",
      header: translate("প্রস্থানের তারিখ", "Departure Date"),
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }) => {
        const coachId = row.original.id;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/supervisor/coach-details/${coachId}`)}
          >
            {translate("দেখুন", "View")}
          </Button>
        );
      },
    },
  ];

  if (coachLoading) {
    return <TableSkeleton columns={10} />;
  }

  return (
    <PageWrapper>
      {/* code for date select */}
      <div className="page-container">
        <div className="flex space-x-4 mb-6">
          {/* Up Date Picker */}
          <Popover
            open={dateRange.upCalendarOpen}
            onOpenChange={(open) =>
              setDateRange((prev) => ({ ...prev, upCalendarOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48"
                disabled={!!dateRange.upDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.upDate
                  ? format(dateRange.upDate, "PPP")
                  : "Select Start Date"}
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

          {/* Down Date Picker */}
          <Popover
            open={dateRange.downCalendarOpen}
            onOpenChange={(open) =>
              setDateRange((prev) => ({ ...prev, downCalendarOpen: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48"
                disabled={!!dateRange.downDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.downDate
                  ? format(dateRange.downDate, "PPP")
                  : "Select End Date"}
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
      </div>
      {/* code for date select */}
      {coachDetailsLoading ? (
        <DetailsSkeleton />
      ) : (
        <div className="grid grid-cols-4 gap-5 my-5">
          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Opening Balance</h2>
              <h2 className="mt-3">
                Total:
                {coachDetailsData?.data?.totalUpOpeningBalance
                  ? coachDetailsData?.data?.totalUpOpeningBalance
                  : 0.0}
              </h2>
            </div>
          </PageTransition>

          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Up Income</h2>
              <h2 className="mt-3">
                Total: {coachDetailsData?.data?.totalUpIncome}
              </h2>
            </div>
          </PageTransition>

          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Down Income </h2>
              <h2 className="mt-3">
                Total: {coachDetailsData?.data?.totalDownIncome}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Total Expense</h2>
              <h2 className="mt-3">
                Total:{coachDetailsData?.data?.totalExpense}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Other Income: </h2>
              <h2 className="mt-3">
                Total:{totalOtherIncome ? totalOtherIncome : 0}
              </h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Cash In Hand </h2>
              <h2 className="mt-3">Total:{chasOnHand ? chasOnHand : 0}</h2>
            </div>
          </PageTransition>
          <PageTransition className="w-full my-2 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <div className="p-6 flex flex-col justify-start items-start w-full">
              <h2>Total Token: </h2>
              <h2 className="mt-3">Piece: 0</h2>
            </div>
          </PageTransition>
        </div>
      )}

      <TableWrapper
        subHeading={translate("কোচ তথ্য উপাত্ত", "Coach Information Data")}
        heading={translate("কোচ তালিকা", "Today's Coach List")}
      >
        <TableToolbar alignment="end">
          <ul className="flex items-center gap-x-2">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "PDF")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachData?.data || []}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SupervisorDashboardHome;
