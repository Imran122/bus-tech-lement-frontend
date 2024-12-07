import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { format } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const TripNoWiseReport = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedTripNo, setSelectedTripNo] = useState<string | undefined>();

  const tripNumbers = ["T123", "T456", "T789"]; // Example static trip numbers

  const staticTableData = [
    {
      index: 1,
      coachNo: "C123",
      routeNo: "R45",
      registrationNo: "ABC-123",
      guideName: "John Doe",
      driverName: "Robert Smith",
      helperName: "Alan Brown",
    },
    {
      index: 2,
      coachNo: "C124",
      routeNo: "R46",
      registrationNo: "DEF-456",
      guideName: "Emily White",
      driverName: "Chris Johnson",
      helperName: "Dave Lee",
    },
  ];

  const incomeTableData = [
    {
      counterName: "Dhaka",
      counterMasterName: "Rafiq",
      qty: 100,
      fare: 1000,
      totalPrice: 100000,
    },
  ];

  const expenseTableData = [
    {
      expenseName: "Fuel",
      amount: 20000,
      totalAmount: 80000,
    },
  ];

  const totalIncome = incomeTableData.reduce(
    (sum, row) => sum + row.totalPrice,
    0
  );
  const totalExpense = expenseTableData.reduce(
    (sum, row) => sum + row.amount,
    0
  );
  const totalAmount = expenseTableData.reduce(
    (sum, row) => sum + row.totalAmount,
    0
  );

  return (
    <section className="p-4">
      {/* Date Range Selector and Trip No Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Select Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[250px] font-normal text-sm ${
                  !date && "text-muted-foreground"
                }`}
              >
                {date?.from
                  ? date.to
                    ? `${format(date.from, "dd-MM-yyyy")} - ${format(
                        date.to,
                        "dd-MM-yyyy"
                      )}`
                    : format(date.from, "dd-MM-yyyy")
                  : "Pick a Date Range"}
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
        </div>

        <div>
          <label className="text-sm font-semibold">Select Trip No</label>
          <Select onValueChange={setSelectedTripNo}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Trip No" />
            </SelectTrigger>
            <SelectContent>
              {tripNumbers.map((tripNo) => (
                <SelectItem key={tripNo} value={tripNo}>
                  {tripNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Previous Table */}
      <div className="border overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Index",
                "Coach No",
                "Route No",
                "Registration No",
                "Guide Name",
                "Driver Name",
                "Helper Name",
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
          <tbody>
            {staticTableData.map((row) => (
              <tr
                key={row.index}
                className="hover:bg-gray-50 text-center text-sm"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {row.index}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.coachNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.routeNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.registrationNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.guideName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.driverName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.helperName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Tables */}
      <div className="flex gap-5 mt-6">
        {/* Left Table: Income */}
        <div className="flex-1 border border-gray-300">
          <table className="table-auto w-full h-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Receive / Income
                </th>
              </tr>
              <tr>
                {[
                  "Counter Name",
                  "Counter Master Name",
                  "Qty",
                  "Fare",
                  "Total Price",
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
            <tbody>
              {incomeTableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-center text-sm"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {row.counterName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.counterMasterName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.qty}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.fare}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.totalPrice}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="font-semibold bg-gray-100">
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-2 text-right"
                >
                  Total Income
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {totalIncome}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Table: Expense */}
        <div className="flex-1 border border-gray-300">
          <table className="table-auto w-full h-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={2}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Expense
                </th>
                <th
                  colSpan={1}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Total Amount
                </th>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Expense Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Amount in Tk
                </th>
              </tr>
            </thead>
            <tbody>
              {expenseTableData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-center text-sm"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {row.expenseName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.totalAmount}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="font-semibold bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-right">
                  Total Expense
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {totalExpense}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* bottom table design total */}
      <div className="border border-gray-300 w-5/12 flex justify-end mt-6">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th
                colSpan={2}
                className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
              >
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Balance Row */}
            <tr className="hover:bg-gray-50 text-sm">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Balance
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {totalIncome - totalExpense}
              </td>
            </tr>
            {/* Gap Row */}
            <tr className="hover:bg-gray-50 text-sm">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Gap
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {totalIncome > totalExpense ? totalIncome - totalExpense : 0}
              </td>
            </tr>
            {/* Gross Income Row */}
            <tr className="hover:bg-gray-50 text-sm">
              <td className="border border-gray-300 px-4 py-2 font-semibold">
                Gross Income
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {totalIncome}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TripNoWiseReport;
