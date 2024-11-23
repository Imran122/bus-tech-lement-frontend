import { useRef, useState } from "react";
import InfoWrapper from "@/components/common/wrapper/InfoWrapper";
import EmptyTableCell from "@/components/ui/emptyTableCell";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fallback } from "@/utils/constants/common/fallback";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import ExpenseCategoryPrint from "@/pages/dashboard/printLabel/ExpenseCategoryPrint";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useReactToPrint } from "react-to-print";
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
import { CalendarIcon } from "lucide-react";
import formatter from "@/utils/helpers/formatter";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { dateFormatter } from "@/utils/helpers/dateFormatter";

const categoryList = [
  { name: "Breakfast", amount: 150, note: "Includes coffee and bagels" },
  { name: "Lunch", amount: 250, note: "Combo meal with drink" },
  { name: "Breakfast", amount: 300, note: "Includes dessert and appetizer" },
  { name: "Lunch", amount: 100, note: "Afternoon tea with biscuits" },
  { name: "Desserts", amount: 120, note: "Cakes and ice cream" },
];

const ProfitandLoseReport = () => {
  const [filteredData, setFilteredData] = useState(categoryList);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  //   const { data: profitAndLossData, isLoading: profitLossLoading } =
  //   useGetProfitLossReportsQuery({
  //     from:
  //       date?.from instanceof Date
  //         ? format(date.from, "yyyy-MM-dd")
  //         : undefined,
  //     to: date?.to instanceof Date ? format(date.to, "yyyy-MM-dd") : undefined,
  //   });
  // GROSS PROFIT CALCULATION
  //  const grossProfit =
  //  parseFloat(profitAndLossData?.data?.totalSell ?? 0) -
  //  parseFloat(profitAndLossData?.data?.totalPurchase ?? 0);

  const fromDate = date?.from ? dateFormatter(date?.from) : null;
  const toDate = date?.to ? dateFormatter(date?.to) : null;

  const dateRange = toDate
    ? toDate === fromDate
      ? fromDate
      : `${fromDate} to ${toDate}`
    : fromDate;

  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});

  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_profit_and_loss_report`,
  });

  // Filter data based on selected category
  const handleRegistrationNoChange = (value: string) => {
    setFilteredData(categoryList.filter((item) => item.name === value));
  };

  if (singleCmsLoading || vehiclesLoading) {
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

      <InfoWrapper
        heading={`Profit / Loss details for the month of ${
          date?.from && date?.to ? dateRange : ""
        }`}
      >
        <div className="-mx-2 border rounded-md overflow-hidden">
          <Table className="overflow-hidden">
            <TableCaption className="mt-0 border-t-[0.5px]">
              A list of your profit and loss reports
            </TableCaption>
            <TableHeader className="bg-muted">
              <TableRow>
                {[
                  "Trip No",
                  "Down Date",
                  "Bus No",
                  "Up-Down Total Amount",
                  "Iconic Transport road expenses",
                  "Iconic Transport Balance",
                  "Iconic Express GP",
                  "Trip wise profit",
                ].map((header) => (
                  <TableHead key={header} className="border-r">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData?.length > 0 ? (
                filteredData?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[
                      //   row.tripNo,
                      //   row.downDate,
                      //   row.busNo,
                      //   row.upDownTotalAmount?.toFixed(2),
                      //   row.transportRoadExpenses?.toFixed(2),
                      //   row.transportBalance?.toFixed(2),
                      //   row.expressGp?.toFixed(2),
                      //   row.tripWiseProfit?.toFixed(2),
                    ].map((value, cellIndex) => (
                      <TableCell key={cellIndex} className="border-r">
                        {value ?? "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="font-semibold">
                <EmptyTableCell item={3} className="custom-table" />
                <TableCell className="border-l">00.00৳</TableCell>
                <TableCell className="border-l">00.00৳</TableCell>
                <TableCell className="border-l">00.00৳</TableCell>
                <TableCell className="border-l">00.00৳</TableCell>
                <TableCell className="border-l">00.00৳</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </InfoWrapper>
      <div className="border rounded-md overflow-hidden mb-10">
        <Table className="overflow-hidden">
          <TableBody className="border">
            {[
              "Actual Profit",
              "Compensation from Iconic Express",
              "Total Monthly Profit",
              "Bus Owner received for Repair & Maintenance",
              "Owner Balance",
            ].map((rowLabel, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="border-l">{rowLabel}</TableCell>
                <TableCell className="border-l">00.00৳</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
