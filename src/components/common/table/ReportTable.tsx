import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React from "react";

interface ReportTableProps {
  mainHeaders: string[];
  subHeaders: string[][];
  data: { [key: string]: { [subHeader: string]: any } }[];
  bordered?: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({
  mainHeaders,
  subHeaders,
  data,
  bordered = true,
}) => {
  const colSpans = subHeaders.map((sub) => sub.length);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-300">
      <Table className={cn(bordered && "border-collapse")}>
        <TableHeader>
          {/* Main Headers Row */}
          <TableRow className="">
            {mainHeaders.map((header, index) => (
              <TableCell
                key={index}
                colSpan={colSpans[index]}
                className="text-center font-semibold border-r border-gray-300"
              >
                {header} {/* Directly display header */}
              </TableCell>
            ))}
          </TableRow>

          {/* Sub-Headers Row */}
          <TableRow className="">
            {subHeaders.map((subHeaderGroup, index) =>
              subHeaderGroup.map((subHeader, subIndex) => (
                <TableCell
                  key={`${index}-${subIndex}`}
                  className="text-center font-semibold border-r border-gray-300"
                >
                  {subHeader} {/* Directly display sub-header */}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((rowData, rowIndex) => (
            <TableRow key={rowIndex}>
              {mainHeaders.map((header, headerIndex) =>
                subHeaders[headerIndex].map((subHeader, subIndex) => (
                  <TableCell
                    key={`${headerIndex}-${subIndex}-${rowIndex}`}
                    className={cn(
                      "p-2 text-center",
                      bordered && "border-b border-r border-gray-300"
                    )}
                  >
                    {rowData[header]?.[subHeader] ?? "-"}
                  </TableCell>
                ))
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;
