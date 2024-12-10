import { Loader } from "@/components/common/Loader";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { useGetPaymentDetailsWithHooksQuery } from "@/store/api/bookingApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FC, useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import PdfPrintTickitOnline from "../dashboard/pdf/PdfPrintTickitOnline";
import TickitPrintClient from "../dashboard/printLabel/TicketPrintClient";

interface IPaymentSuccessProps {}

const PaymentSuccess: FC<IPaymentSuccessProps> = () => {
  const { transactionDetails } = useParams<{ transactionDetails: string }>();
  const { data, isLoading } =
    useGetPaymentDetailsWithHooksQuery(transactionDetails);
  const [saleData, setSaleData] = useState<any>();

  const { data: singleCms } = useGetSingleCMSQuery({});
  const promiseResolveRef = useRef<any>(null);
  const printSaleRef = useRef(null);

  const handlePrintInvoice = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleData?.bookingInfo?.data?.ticketNo}`,
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setSaleData({});
    },
  });

  const fetchSaleData = () => {
    const fetchedData = shareWithLocal("get", `${appConfiguration.appName}`);
    if (fetchedData) {
      setSaleData(fetchedData);
    } else {
      console.error("Failed to fetch sale data from local storage.");
    }
  };

  useEffect(() => {
    fetchSaleData();
  }, []);
  const qrData = JSON.stringify({
    phone: saleData?.bookingInfo?.data?.phone || "N/A",
    ticketNo: saleData?.bookingInfo?.data?.ticketNo || "404NOTFOUND",
    seats: saleData?.bookingInfo?.data?.orderSeat
      ?.map((seat: any) => seat?.seat)
      .join(", "),
    customerName: saleData?.bookingInfo?.data?.customerName,
    address: saleData?.bookingInfo?.data?.address,
    boardingPoint: saleData?.bookingInfo?.data?.boardingPoint,
    droppingPoint: saleData?.bookingInfo?.data?.droppingPoint,
    departureDate:
      saleData?.bookingInfo?.data?.orderSeat?.[0]?.coachConfig?.departureDate,
    schedule:
      saleData?.bookingInfo?.data?.orderSeat?.[0]?.coachConfig?.schedule,
  });
  if (isLoading) {
    return <DetailsSkeleton />;
  }
  return (
    <section>
      <PageWrapper>
        <div className="flex justify-center">
          <div className="w-full border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] md:w-5/12 lg:w-6/12 shadow-lg rounded-lg p-8 text-center my-10 border-green-600">
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
                {data?.data?.bankTransId}
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
            <h3 className="text-xl font-semibold text-center mb-4">
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
                <span className="font-semibold">Date:</span>{" "}
                {data?.data?.order?.date}
              </p>
              <p>
                <span className="font-semibold">Seats:</span>{" "}
                {data?.data?.order?.noOfSeat}
              </p>
            </div>

            <div className="flex justify-center items-center gap-3">
              {/* Print Ticket */}
              <div className="mt-6">
                <Button onClick={handlePrintInvoice}>Print Ticket</Button>
              </div>

              {/* PDF Download */}
              <div className="mt-6">
                <PDFDownloadLink
                  document={
                    <PdfPrintTickitOnline
                      tickitData={saleData?.bookingInfo}
                      logo={singleCms?.data}
                      qrData={qrData}
                    />
                  }
                  fileName="tickit.pdf"
                >
                  {
                    //@ts-ignore
                    (params) => {
                      const { loading } = params;
                      return loading ? (
                        <Button
                          disabled
                          className="transition-all duration-150"
                        >
                          <Loader /> Download
                        </Button>
                      ) : (
                        <Button>Download</Button>
                      );
                    }
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Hidden for Print */}
      <div className="invisible hidden -left-full">
        {saleData?.bookingInfo && (
          <TickitPrintClient
            ref={printSaleRef}
            tickitData={saleData?.bookingInfo}
            logo={singleCms?.data}
          />
        )}
      </div>
    </section>
  );
};

export default PaymentSuccess;
