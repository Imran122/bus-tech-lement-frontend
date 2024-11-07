import { FC } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";

import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { useGetPaymentDetailsWithHooksQuery } from "@/store/api/bookingApi";

interface IPaymentSuccessProps {}

const PaymentSuccess: FC<IPaymentSuccessProps> = () => {
  const { transactionDetails } = useParams<{ transactionDetails: string }>();
  const { data, isLoading } =
    useGetPaymentDetailsWithHooksQuery(transactionDetails);

  const handlePrint = () => {
    window.print();
  };
  console.log("data", data);
  if (isLoading) {
    return <DetailsSkeleton />;
  }

  return (
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
            Thank you for your payment. We will be in contact with more details
            shortly.
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

          {/* Print Button */}
          <Button onClick={handlePrint} className="mt-6">
            Print Receipt
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentSuccess;
