import { Paragraph } from "@/components/common/typography/Paragraph";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import React from "react";

interface IProfitandLossPrintProps {
  profitData: any;
  logo: any;
  dateRange: any;
}

const ProfitandLossPrint = React.forwardRef<
  HTMLDivElement,
  IProfitandLossPrintProps
>(({ profitData: profitInfo, logo, dateRange }, ref) => {
  const { appName } = appConfiguration;

  return (
    <section ref={ref}>
      <section className="w-full h-full break-after-page text-black font-anek mx-auto px-[40px] pt-[30px] pb-[10px]">
        <div className="my-3">
          <img src={logo?.companyLogoBangla} alt="app logo" className="w-60 mx-auto" />
          <Paragraph size={"md"} className="text-center">{appName}</Paragraph>
          <Paragraph size={"sm"} className="text-center">Date Range: {dateRange}</Paragraph>
        </div>
        <div className="border overflow-hidden">
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
              {profitInfo?.length > 0 ? (
                profitInfo.map((row: any, rowIndex: any) => (
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
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.totalIncome - row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.cashOnHand || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitInfo
                    ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitInfo
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
        <div className="border overflow-hidden my-10">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <tbody>
              {[
                {
                  label: "Actual Profit",
                  value: `${
                    profitInfo
                      ?.reduce(
                        (acc: any, row: any) =>
                          acc + (row.cashOnHand - row.gp || 0),
                        0
                      )
                      .toFixed(2) ?? "0.00"
                  }`,
                },
                { label: "Compensation from Iconic Express", value: "00.00" },
                { label: "Total Monthly Profit", value: "00.00" },
                {
                  label: "Bus Owner received for Repair & Maintenance",
                  value: "00.00",
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
        </div>
      </section>
    </section>
  );
});

export default ProfitandLossPrint;
