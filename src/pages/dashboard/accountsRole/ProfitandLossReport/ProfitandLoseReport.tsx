import { useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import ExpenseCategoryPrint from "@/pages/dashboard/printLabel/ExpenseCategoryPrint";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { dateFormatter } from "@/utils/helpers/dateFormatter";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { useReactToPrint } from "react-to-print";
import { useGetTripReportQuery } from "@/store/api/adminReport/adminReportApi";
import { format } from "date-fns";
import { Heading } from "@/components/common/typography/Heading";

const categoryList = [
  { name: "Breakfast", amount: 150, note: "Includes coffee and bagels" },
  { name: "Lunch", amount: 250, note: "Combo meal with drink" },
  { name: "Breakfast", amount: 300, note: "Includes dessert and appetizer" },
  { name: "Lunch", amount: 100, note: "Afternoon tea with biscuits" },
  { name: "Desserts", amount: 120, note: "Cakes and ice cream" },
];

const ProfitandLoseReport = () => {
  const [filteredData, setFilteredData] = useState(categoryList);
  const [selectedRegistrationNo, setSelectedRegistrationNo] = useState<
    string | undefined
  >();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});

  const { data: profitAndLossData, isLoading: profitLossLoading } =
    useGetTripReportQuery(
      selectedRegistrationNo &&
        date?.from instanceof Date &&
        date?.to instanceof Date
        ? {
            registrationNo: selectedRegistrationNo,
            fromDate: format(date.from, "yyyy-MM-dd"),
            toDate: format(date.to, "yyyy-MM-dd"),
          }
        : skipToken 
    );


  const fromDate = date?.from ? dateFormatter(date?.from) : null;
  const toDate = date?.to ? dateFormatter(date?.to) : null;

  const dateRange = toDate
    ? toDate === fromDate
      ? fromDate
      : `${fromDate} to ${toDate}`
    : fromDate;

  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_profit_and_loss_report`,
  });

  // Filter data based on selected category
  const handleRegistrationNoChange = (value: string) => {
    setSelectedRegistrationNo(value); // Update state for backend query
    setFilteredData(categoryList.filter((item) => item.name === value)); // Filter table data
  };

  if (singleCmsLoading || vehiclesLoading || profitLossLoading) {
    return <Loader />;
  }

  return (
    <section className="pt-4">
      <Paragraph className="text-center pb-4" size={"lg"}>
        Iconic Transport
      </Paragraph>

      <div className="flex justify-between items-center">
        {/* <ul className="flex space-x-3">
          <li>
          <PDFDownloadLink
              document={<PdfExpenseCategoryReport result={categoryList} />}
              fileName="expense_category_report.pdf"
            >
              {
                //@ts-ignore
                (params) => {
                  const { loading } = params;
                  return loading ? (
                    <Button
                      disabled
                      className="transition-all duration-150"
                      variant="destructive"
                      size="xs"
                    >
                      <Loader /> Pdf
                    </Button>
                  ) : (
                    <Button variant="destructive" size="xs">
                      Pdf
                    </Button>
                  );
                }
              }
            </PDFDownloadLink>
          </li>
          <li>
            <Button onClick={handlePrint} variant="destructive" size="xs">
              Print
            </Button>
          </li>
        </ul> */}

        <div className="flex space-x-4">
          <Select onValueChange={handleRegistrationNoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a bus no" />
            </SelectTrigger>
            <SelectContent>
              {vehiclesData?.data?.map((option: any) => (
                <SelectItem key={option.id} value={option.registrationNo}>
                  {option.registrationNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <InputWrapper label="Select Date Range" labelFor="date_range">
            <Popover>
              <PopoverTrigger id="date_range" asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] font-normal text-sm",
                    !date && "text-muted-foreground"
                  )}
                >
                  {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                  {date?.from ? (
                    date.to ? (
                      `${dateFormatter(date.from)} - ${dateFormatter(date.to)}`
                    ) : (
                      dateFormatter(date.from)
                    )
                  ) : (
                    <span className="text-sm">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </div>
      </div>

      <section className="mt-10">
        <Heading size={"h6"}>{`Profit / Loss details for the month of ${
          date?.from && date?.to ? dateRange : ""
        }`}</Heading>
        <div className="border rounded-md overflow-hidden">
          <table className="table-auto w-full border-collapse border border-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Trip No",
                  "Down Date",
                  "Bus No",
                  "Up-Down Total Amount",
                  "Iconic Transport Road Expenses",
                  "Iconic Transport Balance",
                  "Iconic Express GP",
                  "Trip Wise Profit",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {profitAndLossData?.data?.length > 0 ? (
                profitAndLossData.data.map((row: any, rowIndex: any) => (
                  <tr
                    key={row.id || rowIndex}
                    className="hover:bg-gray-50 text-center"
                  >
                    {[
                      row.id, // Trip No
                      row.downDate ?? "N/A", // Down Date
                      row.registrationNo ?? "N/A", // Bus No
                      (row.totalIncome - row.totalExpense)?.toFixed(2) ??
                        "0.00",
                      row.totalExpense?.toFixed(2) ?? "0.00",
                      row.cashOnHand?.toFixed(2) ?? "0.00",
                      row.gp?.toFixed(2) ?? "0.00",
                      (row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00",
                    ].map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2 h-12 w-32 text-sm"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-gray-500 py-4 border border-gray-300"
                  >
                    No data available
                  </td>
                </tr>
              )}

              {/* Footer Row (Totals) */}
              <tr className="font-semibold bg-gray-100 text-center">
                <td className="border border-gray-300 px-4 py-2">Totals</td>
                {[...Array(2)].map((_, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2"></td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.totalIncome - row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.cashOnHand || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.cashOnHand - row.gp || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border rounded-md overflow-hidden my-10">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <tbody>
            {[
              {
                label: "Actual Profit",
                value:
                  profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.cashOnHand - row.gp || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00",
              },
              { label: "Compensation from Iconic Express", value: "00.00৳" },
              { label: "Total Monthly Profit", value: "00.00৳" },
              {
                label: "Bus Owner received for Repair & Maintenance",
                value: "00.00৳",
              },
              { label: "Owner Balance", value: "00.00৳" },
            ].map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {row.label}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="invisible hidden -left-full">
        {filteredData.length > 0 && (
          <ExpenseCategoryPrint
            ref={printSaleRef}
            categoryData={filteredData}
            logo={singleCms?.data}
          />
        )}
      </div>
    </section>
  );
};

export default ProfitandLoseReport;
