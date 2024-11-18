import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import AccountantReportTable from "@/components/common/table/AccountantReportTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetAccountReportDetailsByIdQuery } from "@/store/api/accounts/accountsDashboardApi";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const DetailsOfReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: reportDetails, isLoading } =
    useGetAccountReportDetailsByIdQuery(id);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (isLoading) {
    return <TableSkeleton columns={5} />;
  }
  if (!reportDetails || !reportDetails.data) {
    return (
      <PageWrapper>
        <h2 className="text-center mt-10 text-xl font-bold">No Report Found</h2>
      </PageWrapper>
    );
  }

  const {
    upWayCollectionReport,
    downWayCollectionReport,
    expenseReport,
    upWayOthersIncomeReport,
  } = reportDetails.data;

  const upWayData = [
    ...upWayCollectionReport,
    ...upWayOthersIncomeReport.map((item: any) => ({
      ...item,
      counterName: item.counterName,
      amount: item.amount,
      file: item.file || null,
    })),
  ];

  const downWayData = [...downWayCollectionReport];
  const maxRows = Math.max(
    upWayData.length,
    downWayData.length,
    expenseReport.length
  );
  const handleFileClick = (file: string | null) => {
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Report Details</h1>
      <PageTransition>
        <div className="grid gap-5 grid-cols-12">
          <div className="col-span-8 flex">
            {/* Up Way Income Table */}
            <AccountantReportTable
              data={upWayData}
              mainHeader="Up Way Income"
              subHeaders={["Counter Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />

            {/* Down Way Income Table */}
            <AccountantReportTable
              data={downWayData}
              mainHeader="Down Way Income"
              subHeaders={["Counter Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />

            {/* Expense Report Table */}
            <AccountantReportTable
              data={expenseReport}
              mainHeader="Expense Report"
              subHeaders={["Expense Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />
          </div>

          {/* Image Display Section */}
          <div className="col-span-4 border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 p-4">
            {selectedFile ? (
              <img
                src={selectedFile}
                alt="Selected"
                className="w-full h-auto object-contain"
              />
            ) : (
              <h2 className="text-center">Click on a file to preview</h2>
            )}
          </div>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default DetailsOfReport;
