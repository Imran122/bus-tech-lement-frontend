import { Paragraph } from "@/components/common/typography/Paragraph";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import React from "react";

interface ITripWiseReportPrintProps {
  reportData: any;
  logo: any;
  dateRange: any;
}

const TripWiseReportPrint = React.forwardRef<
  HTMLDivElement,
  ITripWiseReportPrintProps
>(({ reportData, logo, dateRange }, ref) => {
  const {
    upWayCoachInfo = [],
    downWayCoachInfo = [],
    collectionReport = [],
    expenseReport = [],
    totalIncome = 0,
    totalExpense = 0,
    totalAmount = 0,
    gp = 0,
  } = reportData?.data || {};

  const { appName } = appConfiguration;

  return (
    <section ref={ref}>
      <section className="w-full h-full break-after-page text-black font-anek mx-auto px-[40px] pt-[30px] pb-[10px]">
        <div className="my-3">
          <img
            src={logo?.companyLogoBangla}
            alt="app logo"
            className="w-60 mx-auto"
          />
          <Paragraph size={"lg"} className="text-center">
            {appName}
          </Paragraph>
          <Paragraph size={"md"} className="text-center">
            Trip Report
          </Paragraph>
          <Paragraph size={"sm"} className="text-center">
            Date Range: {dateRange}
          </Paragraph>
        </div>

        {/* Main Table */}
        <div className="border">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Coach",
                  "Coach No",
                  "Route Name",
                  "Registration No",
                  "Supervisor Name",
                  "Driver Name",
                  "Helper Name",
                  "Schedule",
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
              {[upWayCoachInfo, downWayCoachInfo].map((info, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-center text-sm"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {index === 0 ? "Up Way Coach" : "Down Way Coach"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.coachNo || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.route?.routeName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.registrationNo || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.supervisor?.userName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.driver?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.helper?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {info?.schedule || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 my-10">
          {/* Income Table */}
          <div className="flex-1 border">
            <table className="table-auto w-full border-collapse">
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
                {collectionReport.map((row: any, index: any) => (
                  <tr key={index} className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {row.counterName || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.counterMasterName || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.noOfPassenger || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.fare || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.amount || 0}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-100">
                  <td
                    colSpan={4}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    Total Income
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {totalIncome}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expense Table */}
          <div className="flex-1 border">
            <table className="table-auto w-full border-collapse">
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
                  {["Expense Name", "Amount", "Amount in Tk"].map(
                    (header, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {expenseReport.map((row: any, index: any) => (
                  <tr key={index} className="hover:bg-gray-50 text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {row.expenseCategory || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.amount || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.amount || 0}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
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

        <div className="border w-5/12 ml-auto">
          <table className="table-auto w-full border-collapse">
            <tbody>
              {[
                { label: "Balance", value: totalIncome - totalExpense },
                { label: "GP", value: gp },
                {
                  label: "Gross Income",
                  value: totalIncome - totalExpense - gp,
                },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {row.label}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {row.value.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
});

export default TripWiseReportPrint;
