import PageTransition from "@/components/common/effect/PageTransition";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Input } from "@/components/ui/input";
import {
  useAddBookingPaymentMutation,
  useGetTickitInfoQuery,
} from "@/store/api/bookingApi";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface IFindTicketPaymentProps {}

const FindTicketPayment: FC<IFindTicketPaymentProps> = () => {
  const { translate } = useCustomTranslator();
  const [ticketNumber, setTicketNumber] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<{ dueAmount: number }>();

  // Fetch ticket information based on ticket number
  const { data, isLoading, error } = useGetTickitInfoQuery(ticketNumber, {
    skip: !ticketNumber,
  });
  const [
    addBookingPayment,
    { isLoading: paymentLoading, error: paymentLoadingError },
  ] = useAddBookingPaymentMutation();

  const dueAmount = data?.data?.dueAmount;
  const ticketData = data?.data;

  const enteredAmount = watch("dueAmount");

  // Handler for ticket number input
  const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketNumber(e.target.value);
  };

  // Validate amount on change
  const validateAmount = () => {
    if (enteredAmount !== dueAmount && enteredAmount !== undefined) {
      setError("dueAmount", {
        type: "manual",
        message: translate(
          "পরিমাণটি অবশ্যই বকেয়া পরিমাণের সমান হতে হবে।",
          "The amount must match the due amount."
        ),
      });
    } else {
      clearErrors("dueAmount");
    }
  };

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

  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center">
        <PageTransition className="p-5 w-8/12 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
          <Heading size="h3">
            {translate("টিকিট খুঁজুন", "Find Ticket")}
          </Heading>

          {/* Input for Ticket Number */}
          <InputWrapper
            labelFor="ticketNumber"
            label={translate("টিকিট নম্বর লিখুন", "Enter Ticket Number")}
          >
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
          </InputWrapper>

          {/* Loading and Error Handling */}
          {isLoading && (
            <Paragraph>{translate("লোড হচ্ছে...", "Loading...")}</Paragraph>
          )}
          {error && (
            <Paragraph>
              {translate("ত্রুটি ঘটেছে", "Error fetching data.")}
            </Paragraph>
          )}

          {/* Display Ticket Data */}
          {ticketData && (
            <div className="p-4 mt-4 rounded shadow">
              <Heading size="h4">
                {translate("টিকিটের তথ্য", "Ticket Information")}
              </Heading>
              <ul className="grid grid-cols-2">
                <li>
                  <strong>{translate("টিকিট নম্বর", "Ticket No")}:</strong>{" "}
                  {ticketData.ticketNo}
                </li>
                <li>
                  <strong>{translate("যাত্রীর নাম", "Customer Name")}:</strong>{" "}
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
                  <strong>{translate("বকেয়া পরিমাণ", "Due Amount")}:</strong>{" "}
                  {dueAmount}
                </li>
                <li>
                  <strong>{translate("সিট", "Seat")}:</strong>{" "}
                  {ticketData.orderSeat
                    .map((seat: any) => seat.seat)
                    .join(", ")}
                </li>
              </ul>
            </div>
          )}

          {/* Input for Due Amount */}
          {ticketData && dueAmount > 0 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputWrapper
                labelFor="dueAmount"
                label={translate(
                  "পরিশোধের পরিমাণ লিখুন",
                  "Enter Payment Amount"
                )}
              >
                <Input
                  id="dueAmount"
                  type="number"
                  placeholder={translate(
                    "এখানে পরিমাণ লিখুন",
                    "Enter amount here"
                  )}
                  {...register("dueAmount", { onChange: validateAmount })}
                />
                {errors.dueAmount && (
                  <Paragraph variant="destructive" size="sm">
                    {errors.dueAmount.message}
                  </Paragraph>
                )}
              </InputWrapper>

              {/* Submit Button to Make Payment */}
              <Submit
                loading={paymentLoading}
                submitTitle={translate(
                  "পেমেন্ট সম্পূর্ণ করুন",
                  "Complete Payment"
                )}
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
  );
};

export default FindTicketPayment;
