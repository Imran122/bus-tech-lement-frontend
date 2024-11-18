import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetAccountReportDetailsByIdQuery } from "@/store/api/accounts/accountsDashboardApi";
import React from "react";
import { useParams } from "react-router-dom";

const DetailsOfReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: reportDetails, isLoading } =
    useGetAccountReportDetailsByIdQuery(id);

  if (isLoading) {
    return <TableSkeleton columns={5} />;
  }
  if (!reportDetails) {
    return (
      <PageWrapper>
        <h2 className="text-center mt-10 text-xl font-bold">No Report Found</h2>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Report Details</h1>
      <PageTransition>
        <div className="grid gap-5 grid-cols-12">
          <div className="col-span-8 border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <h2>table</h2>
          </div>
          <div className="col-span-4 border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <h2>image</h2>
          </div>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default DetailsOfReport;
