import PageTransition from "@/components/common/effect/PageTransition";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Loader } from "@/components/common/Loader";
import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddBookingPaymentMutation,
  useGetTickitInfoQuery,
} from "@/store/api/bookingApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import TickitPrintClient from "../dashboard/printLabel/TicketPrintClient";

interface IFindTicketPaymentProps {}

const FindTicketPayment: FC<IFindTicketPaymentProps> = () => {
  const { translate } = useCustomTranslator();
  const [ticketNumber, setTicketNumber] = useState("");
  const { handleSubmit } = useForm<{ dueAmount: number }>();
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const [searchTicketNumber, setSearchTicketNumber] = useState("");
  const [searching, setSearching] = useState<boolean>(false);
  const [saleData, setSaleData] = useState<any>();

  const { data, isLoading, error } = useGetTickitInfoQuery(searchTicketNumber, {
    skip: !searchTicketNumber,
  });

  const [
    addBookingPayment,
    { isLoading: paymentLoading, error: paymentLoadingError },
  ] = useAddBookingPaymentMutation();

  const dueAmount = data?.data?.dueAmount;
  const ticketData = data?.data;

  // Handler for ticket number input
  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketNumber(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    if (ticketNumber.trim()) {
      setSearchTicketNumber(ticketNumber);
      setSearching(true);
    }
  };

  // Reset the searching state after data or error is received
  useEffect(() => {
    if (data || error) {
      setSearching(false);
    }
  }, [data, error]);

  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);
  const printSaleRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleData?.data?.ticketNo}`,
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      // setClear(false);
      setSaleData({});
    },
  });

  const invoicePrintHandler = () => {
    if (data) {
      setSaleData(data);
    } else {
      console.error("Failed to fetch sale data from local storage.");
    }
  };
  useEffect(() => {
    if (saleData && Object.keys(saleData).length > 0) {
      handlePrint();
    }
  }, [handlePrint, saleData]);

  // Handle form submission
  const onSubmit = async () => {
    try {
      const payment = await addBookingPayment(ticketData?.id);
      if (payment.data?.success) {
        playSound("success");
        toast.success(
          translate("পেমেন্ট সফল হয়েছে।", "Payment was successful.")
        );

        if (payment.data?.data?.url) {
          window.location.href = payment.data.data.url;
        }
      } else {
        throw new Error("Payment unsuccessful");
      }
    } catch (error) {
      toast.error(
        translate(
          "পেমেন্টে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
          "There was an issue with the payment. Please try again."
        )
      );
    }
  };

  if (singleCmsLoading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen">
      <PageWrapper>
        <div className="flex flex-col justify-center items-center">
          <PageTransition className="p-5 w-full lg:w-8/12 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <Heading size="h4" className="text-center">
              {translate("টিকিট খুঁজুন", "Find Ticket")}
            </Heading>

            {/* Input for Ticket Number */}
            <InputWrapper
              labelFor="ticketNumber"
              label={translate("টিকিট নম্বর লিখুন", "Enter Ticket Number")}
              className="w-full lg:w-1/2 mx-auto"
            >
              <div className="flex items-center gap-5">
                <Input
                  id="ticketNumber"
                  type="text"
                  placeholder={translate(
                    "এখানে টিকিট নম্বর লিখুন",
                    "Enter ticket number here"
                  )}
                  value={ticketNumber}
                  onChange={handleTicketNumberChange}
                />

                <Button
                  size={"default"}
                  variant={"primary"}
                  onClick={handleSearchClick}
                  disabled={searching || !ticketNumber}
                >
                  {searching
                    ? translate("অনুসন্ধান হচ্ছে...", "Searching...")
                    : translate("অনুসন্ধান", "Search")}
                </Button>
              </div>
            </InputWrapper>

            <div className="flex flex-col justify-center py-5">
              {/* Loading and Error Handling */}
              {isLoading && (
                <Paragraph className="text-center">
                  {translate("লোড হচ্ছে...", "Loading...")}
                </Paragraph>
              )}
              {error && (
                <Paragraph className="text-center">
                  {translate(
                    "ত্রুটি ঘটেছে, অনুগ্রহ করে একটি সঠিক টিকিট নম্বর বা ফোন নম্বর দিন।",
                    "Error fetching data. Please give valid ticket No or Phone number"
                  )}
                </Paragraph>
              )}

              {/* Display Ticket Data */}
              {ticketData && (
                <div className="px-4 pb-5 rounded shadow">
                  <Heading size="h4" className="pb-5">
                    {translate("টিকিটের তথ্য", "Ticket Information")}
                  </Heading>
                  <ul className="grid grid-cols-2 mx-auto items-center">
                    <li>
                      <strong>{translate("টিকিট নম্বর", "Ticket No")}:</strong>{" "}
                      {ticketData.ticketNo}
                    </li>
                    <li>
                      <strong>
                        {translate("যাত্রীর নাম", "Customer Name")}:
                      </strong>{" "}
                      {ticketData.customerName}
                    </li>
                    <li>
                      <strong>{translate("ফোন নম্বর", "Phone")}:</strong>{" "}
                      {ticketData.phone}
                    </li>
                    <li>
                      <strong>{translate("ইমেইল", "Email")}:</strong>{" "}
                      {ticketData.email}
                    </li>
                    <li>
                      <strong>
                        {translate("বকেয়া পরিমাণ", "Due Amount")}:
                      </strong>{" "}
                      {dueAmount}
                    </li>
                    <li>
                      <strong>{translate("সিট", "Seat")}:</strong>{" "}
                      {ticketData.orderSeat
                        .map((seat: any) => seat.seat)
                        .join(", ")}
                    </li>
                  </ul>
                  {dueAmount === 0 && (
                    <div className="flex justify-end mt-10">
                      <Button onClick={invoicePrintHandler}>
                        Print Ticket
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input for Due Amount */}
            {ticketData && dueAmount > 0 && (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Submit Button to Make Payment */}
                <Submit
                  loading={paymentLoading}
                  submitTitle={translate("পেমেন্ট করুন", "Pay")}
                  errors={paymentLoadingError}
                  errorTitle={translate(
                    "পেমেন্ট সম্পূর্ণ করতে ত্রুটি হয়েছে",
                    "Payment Error"
                  )}
                />
              </form>
            )}
          </PageTransition>
        </div>
      </PageWrapper>
      <div className="invisible hidden -left-full">
        {saleData && (
          <TickitPrintClient
            ref={printSaleRef}
            tickitData={saleData}
            logo={singleCms?.data}
          />
        )}
      </div>
    </section>
  );
};

export default FindTicketPayment;
