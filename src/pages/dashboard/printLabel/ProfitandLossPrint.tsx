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
    <section ref={ref} className="w-[794px] mx-auto pt-5 pb-5">
      {/* A4 Width: 794px */}
      <section className="w-full h-full text-black font-anek px-5">
        {/* Header */}
        <div className="my-3 text-center">
          <img
            src={logo?.companyLogoBangla}
            alt="app logo"
            className="w-40 mx-auto"
          />
          <Paragraph size={"md"}>{appName}</Paragraph>
          <Paragraph size={"sm"}>Date Range: {dateRange}</Paragraph>
        </div>

        {/* Main Table */}
        <div className="mt-5">
          <table className="table-auto text-center w-full border-collapse border border-gray-200 text-xs">
            {/* Table Header */}
            <thead className="bg-gray-100">
              <tr>
                {[
                  { label: "Date" },
                  { label: "Trip No" },
                  { label: "Bus No" },
                  { label: "Up Date" },
                  { label: "Down Date" },
                  { label: "Passenger Up", width: "40px" }, // Narrower
                  { label: "Passenger Down", width: "40px" }, // Narrower
                  { label: "Passenger Total", width: "40px" }, // Narrower
                  { label: "Up Income" }, // Narrower
                  { label: "Down Income" }, // Narrower
                  { label: "Up-Down Total Amount" },
                  { label: "Road Expenses" },
                  { label: "Total Balance" },
                  { label: "Iconic Express GP" },
                  { label: "Trip Wise Profit" },
                ].map((header, index) => (
                  <th
                    key={index}
                    className={`border border-gray-300 text-wrap px-1 py-2 text-center font-semibold `}
                    style={{ width: header.width }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-center">
              {profitInfo?.length > 0 ? (
                profitInfo.map((row: any, rowIndex: any) => (
                  <tr key={row.id || rowIndex} className="text-center">
                    {[
                      row.date ?? "N/A",
                      row.id ?? "N/A",
                      row.registrationNo ?? "N/A",
                      row.upDate ?? "N/A",
                      row.downDate ?? "N/A",
                      row.passengerUpWay ?? "0",
                      row.passengerDownWay ?? "0",
                      row.totalPassenger ?? "0",
                      row.upWayIncome?.toFixed(2) ?? "0.00",
                      row.downWayIncome?.toFixed(2) ?? "0.00",
                      (row.upWayIncome + row.downWayIncome)?.toFixed(2) ??
                        "0.00",
                      row.totalExpense?.toFixed(2) ?? "0.00",
                      row.cashOnHand?.toFixed(2) ?? "0.00",
                      row.gp?.toFixed(2) ?? "0.00",
                      (row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00",
                    ].map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`border border-gray-300  px-1 py-2 ${
                          cellIndex >= 5 && cellIndex <= 9
                            ? "text-center "
                            : "text-center "
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={15}
                    className="text-center text-gray-500 py-4 border border-gray-300"
                  >
                    No data available
                  </td>
                </tr>
              )}

              {/* Totals Row */}
              <tr className="font-semibold  bg-gray-100 text-center">
                <td className="border border-gray-300 px-1 py-2">Totals</td>
                {[...Array(9)].map((_, i) => (
                  <td key={i} className="border border-gray-300 px-1 py-2"></td>
                ))}
                <td className="border border-gray-300 px-1 py-2">
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.upWayIncome + row.downWayIncome || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {profitInfo
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.cashOnHand || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-1 py-2">
                  {profitInfo
                    ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-1 py-2">
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

        {/* Bottom Table */}
        <div className="flex justify-end overflow-hidden mt-10">
          <div className="border w-6/12">
            <table className="font-semibold table-auto w-full border-collapse border border-gray-200 mx-auto text-xs">
              <tbody>
                {[
                  {
                    label: "Total Up & Down Income",
                    value: `${
                      profitInfo
                        ?.reduce(
                          (acc: any, row: any) =>
                            acc + (row.upWayIncome + row.downWayIncome || 0),
                          0
                        )
                        .toFixed(2) ?? "0.00"
                    }`,
                  },
                  {
                    label: "Road Expenses",
                    value: `${
                      profitInfo
                        ?.reduce(
                          (acc: any, row: any) => acc + (row.totalExpense || 0),
                          0
                        )
                        .toFixed(2) ?? "0.00"
                    }`,
                  },
                  {
                    label: "Total Balance",
                    value: `${
                      profitInfo
                        ?.reduce(
                          (acc: any, row: any) => acc + (row.cashOnHand || 0),
                          0
                        )
                        .toFixed(2) ?? "0.00"
                    }`,
                  },
                  {
                    label: "GP",
                    value: `${
                      profitInfo
                        ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                        .toFixed(2) ?? "0.00"
                    }`,
                  },
                  {
                    label: "Total Profit",
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
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-2 py-2 font-semibold">
                      {row.label}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
});

export default ProfitandLossPrint;
