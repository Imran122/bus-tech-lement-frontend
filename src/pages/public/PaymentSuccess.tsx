import { FC, useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { useGetPaymentDetailsWithHooksQuery } from "@/store/api/bookingApi";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import TickitPrintClient from "../dashboard/printLabel/TicketPrintClient";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

interface IPaymentSuccessProps {}

const PaymentSuccess: FC<IPaymentSuccessProps> = () => {
  const { transactionDetails } = useParams<{ transactionDetails: string }>();
  const { data, isLoading } =
    useGetPaymentDetailsWithHooksQuery(transactionDetails);
  const [saleData, setSaleData] = useState<any>();

  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );

  const handlePrint = () => {
    window.print();
  };
  const promiseResolveRef = useRef<any>(null);
  const printSaleRef = useRef(null);
  const handlePrintInvoice = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleData?.bookingInfo?.data?.ticketNo}`,
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      // setClear(false);
      setSaleData({});
    },
  });
  const invoicePrintHandler = () => {
    const data = shareWithLocal("get", `${appConfiguration.appName}`);
    if (data) {
      setSaleData(data);
    } else {
      console.error("Failed to fetch sale data from local storage.");
    }
  };
  
  
  useEffect(() => {
    if (saleData && Object.keys(saleData).length > 0) {
      handlePrintInvoice();
    }
  }, [handlePrintInvoice, saleData]);
  
  if (isLoading) {
    return <DetailsSkeleton />;
  }

  return (
    <section>
      <PageWrapper>
        <div className="flex justify-center  ">
          <div className="w-full border-2   border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] md:w-5/12 lg:w-6/12 shadow-lg rounded-lg p-8 text-center my-10  border-green-600">
            {/* Success Icon */}
            <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />

            {/* Success Message */}
            <h2 className="text-3xl font-semibold my-3">
              Your payment was successful
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your payment. We will be in contact with more
              details shortly.
            </p>

            {/* Transaction and Payment Details */}
            <h3 className="text-xl font-semibold text-center mb-4">
              Transaction Details
            </h3>
            <div className="my-6 border-t pt-4 text-left grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">Transaction ID:</span>{" "}
                {transactionDetails}
              </p>
              <p>
                <span className="font-semibold">Bank Transaction ID:</span>{" "}
                {data.data.bankTransId}
              </p>
              <p>
                <span className="font-semibold">Card Type:</span>{" "}
                {data?.data?.cardType}
              </p>
              <p>
                <span className="font-semibold">Issuer:</span>{" "}
                {data?.data?.cardIssuer}
              </p>
              <p>
                <span className="font-semibold">Total Amount:</span>{" "}
                {data?.data?.order?.amount}
              </p>
              <p>
                <span className="font-semibold">Paid Amount:</span>{" "}
                {data?.data?.amount}
              </p>
              <p>
                <span className="font-semibold">Due Amount:</span>{" "}
                {data?.data?.order?.dueAmount}
              </p>
            </div>

            {/* Ticket Details */}
            <h3 className="text-xl font-semibold text-center mb-4 ">
              Ticket Information
            </h3>
            <div className="my-6 border-t pt-4 text-left grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold">Ticket No:</span>{" "}
                {data?.data?.order?.ticketNo}
              </p>
              <p>
                <span className="font-semibold">Customer Name:</span>{" "}
                {data?.data?.order?.customerName}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {data?.data?.order?.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {data?.data?.order?.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Boarding Point:</span>{" "}
                {data?.data?.order?.boardingPoint}
              </p>
              <p>
                <span className="font-semibold">Dropping Point:</span>{" "}
                {data?.data?.order?.droppingPoint}
              </p>
              <p>
                <span className="font-semibold">Schedule:</span>{" "}
                {data?.data?.order?.schedule}
              </p>
              <p>
                <span className="font-semibold">Seats:</span>{" "}
                {data?.data?.order?.noOfSeat}
              </p>
            </div>

            <div className="flex justify-center items-center gap-3">
              {/* print ticket */}
              {data?.data?.order?.dueAmount === 0 ? (
                <div className="mt-6">
                  <Button onClick={invoicePrintHandler}>Print Ticket</Button>
                </div>
              ) : (
                ""
              )}
              {/* Print Button */}
              <Button onClick={handlePrint} className="mt-6">
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
      <div className="invisible hidden -left-full">
        {saleData?.bookingInfo && (
          <TickitPrintClient ref={printSaleRef} tickitData={saleData?.bookingInfo} logo={singleCms?.data}/>
        )}
      </div>
    </section>
  );
};

export default PaymentSuccess;
