/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Heading } from "@/components/common/typography/Heading";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  INationalityOptionsProps,
  nationalitiesOptions,
} from "@/utils/constants/common/nationalitiesOptions";
import { addBookingSeatForm } from "@/utils/constants/form/addBookingForm";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

import PageTransition from "@/components/common/effect/PageTransition";
import Submit from "@/components/common/form/Submit";
import { VanishList } from "@/components/common/form/VanishList";
import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  AddBookingSeatDataProps,
  addBookingSeatSchema,
} from "@/schemas/booking/addBookingSeatSchema";
import {
  useAddBookingMutation,
  useAddBookingPaymentMutation,
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import {
  IPaymentMethodOptions,
  paymentMethodOptions,
} from "@/utils/constants/common/paymentMethodOptions";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SeatLayoutSelector from "@/components/common/busSeatLayout/SeatLayoutSelector";
import { playSound } from "@/utils/helpers/playSound";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { toast } from "sonner";

interface IBookingFormProps {
  bookingCoach: any;
}
interface IBookingFormStateProps {
  targetedSeat: number | null;
  selectedSeats: any[];
  redirectLink: string | null;
  customerName: string | null;
  redirectConfirm: boolean;
}

const BookingForm: FC<IBookingFormProps> = ({ bookingCoach }) => {
  const { translate } = useCustomTranslator();
  //console.log("dropdown boardinpoint:", bookingCoach);
  const [bookingFormState, setBookingFormState] =
    useState<IBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });

  const [addBooking, { isLoading: addBookingLoading, error: addBookingError }] =
    useAddBookingMutation({}) as any;
  const [
    addBookingPayment,
    { isLoading: addBookingPaymentLoading, error: addBookingPaymentError },
  ] = useAddBookingPaymentMutation({}) as any;
  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation({}) as any;
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;
  const [
    checkingSeat,
    { isLoading: checkingSeatLoading, error: checkingSeatError },
  ] = useCheckingSeatMutation({}) as any;

  const totalAmount =
    totalCalculator(bookingFormState?.selectedSeats, "currentAmount") || 0;

  const totalSeats = bookingFormState?.selectedSeats?.length || 0;
  const seatsAllocation = (() => {
    switch (bookingCoach.coachClass) {
      case "E_Class":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      case "B_Class":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      case "Sleeper":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      case "S_Class":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  })();

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBookingSeatDataProps>({
    resolver: zodResolver(addBookingSeatSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const partialAmount = watch("paymentAmount");
  const dueAmount = partialAmount ? totalAmount - partialAmount : 0;
  const handleBookingSeat = async (seatData: any) => {
    const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
      (current: any) => current.seat === seatData.seat
    );

    if (isSeatAlreadySelected) {
      // Remove the seat if it's already selected
      const result = await removeBookingSeat({
        coachConfigId: bookingCoach?.id,
        date: bookingCoach?.departureDate,
        schedule: bookingCoach?.schedule,
        seat: seatData?.seat,
      });

      if (result?.data?.success) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat) => seat.seat !== seatData.seat
          ),
        }));
      }
    } else {
      // Add the seat if it's not already selected
      const result = await addBookingSeat({
        coachConfigId: bookingCoach?.id,
        date: bookingCoach?.departureDate,
        schedule: bookingCoach?.schedule,
        seat: seatData?.seat,
      });

      if (result?.data?.data?.available) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: [
            ...prevState.selectedSeats,
            {
              ...seatData,
              currentAmount: bookingCoach?.fare?.amount,
              previousAmount: bookingCoach?.fare?.amount,
            },
          ],
        }));
      }
    }
  };

  useEffect(() => {
    setValue("coachConfigId", bookingCoach?.id);
    setValue("schedule", bookingCoach?.schedule);
    setValue("amount", totalAmount);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);

    if (bookingFormState?.selectedSeats?.length) {
      setValue(
        "seats",
        bookingFormState.selectedSeats.map((singleSeat: any) => singleSeat.seat)
      );
    }
  }, [
    bookingCoach?.departureDate,
    bookingCoach?.id,
    bookingCoach?.schedule,
    bookingFormState.selectedSeats,
    setValue,
    totalAmount,
    totalSeats,
  ]);

  useEffect(() => {
    if (bookingFormState?.redirectLink && bookingFormState?.redirectConfirm) {
      toast.success(
        translate(
          `প্রিয় ${bookingFormState?.customerName}, আপনার সিট সফলভাবে বুক করা হয়েছে! আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ।`,
          `Dear ${bookingFormState?.customerName}, your seat has been successfully booked! Thank you for choosing our service.`
        )
      );

      setTimeout(() => {
        const paymentPromise = new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        toast.promise(paymentPromise, {
          loading: translate("পুনঃনির্দেশিত হচ্ছে...", "Redirecting..."),
          success: () => {
            setTimeout(() => {
              if (bookingFormState.redirectLink) {
                window.location.href = bookingFormState.redirectLink;
              }
            }, 1500);
            return translate(
              "পেমেন্টের জন্য পুনঃনির্দেশনা সম্পন্ন হয়েছে।",
              "Redirecting is complete for payment."
            );
          },
          error: translate("ত্রুটি ঘটেছে", "Error occurred"),
        });
      }, 3000);

      // Mark redirectConfirm as false to prevent re-running this effect
      setBookingFormState((prevState: IBookingFormStateProps) => ({
        ...prevState,
        redirectConfirm: false,
      }));
    }
  }, [
    bookingFormState?.redirectLink,
    bookingFormState?.redirectConfirm,
    bookingFormState?.customerName,
    translate,
  ]);
  const paymentType = watch("paymentType"); // Watch the paymentType value

  const onSubmit = async (data: AddBookingSeatDataProps) => {
    const cleanedData = removeFalsyProperties(data, [
      "nid",
      "email",
      "nationality",
      "address",
      "customerName",
      "gender",
    ]);
    const check = await checkingSeat({
      coachConfigId: cleanedData.coachConfigId,
      schedule: cleanedData.schedule,
      date: cleanedData.date,
      seats: cleanedData?.seats,
    });
    console.log("data", data);
    if (check?.data?.data?.available) {
      const booking = await addBooking(cleanedData);

      if (booking.data?.success) {
        const payment = await addBookingPayment(booking?.data?.data?.id);
        if (payment.data?.success) {
          playSound("success");
          setBookingFormState((prevState: IBookingFormStateProps) => ({
            ...prevState,
            redirectLink: payment?.data?.data?.url,
            customerName: booking.data?.data?.customerName,
            redirectConfirm: true,
          }));
        }
      }
    } else {
      const targetSeat = check?.data?.message?.split(" ")[0];

      toast.warning(
        translate(
          `দুঃখিত, আপনার নির্বাচিত সিট "${targetSeat}" এখন আর পাওয়া যাচ্ছে না। আপনি অন্য একটি সিট নির্বাচন করতে পারেন।`,
          `Sorry, your selected seat "${targetSeat}" is no longer available. You can choose another seat.`
        )
      );

      playSound("warning");
    }
  };

  return (
    <PageTransition>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row items-start my-0 h-full mt-6 px-4 gap-x-12 ">
          {/* COUCH SEAT PLAN CONTAINER */}
          <PageTransition className="w-4/12 flex items-center flex-col border-2 rounded-md justify-center  border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
            <SeatLayoutSelector
              checkingSeat={checkingSeat}
              bookingCoach={bookingCoach}
              coachClass={bookingCoach.coachClass}
              //@ts-ignore
              seatsAllocation={seatsAllocation}
              handleBookingSeat={handleBookingSeat}
              bookingFormState={bookingFormState}
              addBookingSeatLoading={addBookingSeatLoading}
              removeBookingSeatLoading={removeBookingSeatLoading}
            />
          </PageTransition>
          {/* CUSTOMER & PAYMENT INFORMATION */}
          <PageTransition className="flex flex-col justify-between h-full w-8/12">
            <div>
              <Heading size="h4">
                {translate(
                  "গ্রাহকের ব্যক্তিগত তথ্য",
                  "Client Personal Information"
                )}
              </Heading>

              <GridWrapper>
                {/* NAME */}
                <InputWrapper
                  className={cn(
                    bookingFormState?.selectedSeats?.length < 3 && "col-span-1"
                  )}
                  labelFor="name"
                  error={errors.customerName?.message}
                  label={translate(
                    addBookingSeatForm.name.label.bn,
                    addBookingSeatForm.name.label.en
                  )}
                >
                  <Input
                    {...register("customerName")}
                    type="text"
                    id="name"
                    placeholder={translate(
                      addBookingSeatForm.name.placeholder.bn,
                      addBookingSeatForm.name.placeholder.en
                    )}
                  />
                </InputWrapper>
                {/* PHONE */}
                <InputWrapper
                  error={errors?.phone?.message}
                  labelFor="phone"
                  label={translate(
                    addBookingSeatForm.phone.label.bn,
                    addBookingSeatForm.phone.label.en
                  )}
                >
                  <Input
                    {...register("phone")}
                    type="tel"
                    id="phone"
                    placeholder={translate(
                      addBookingSeatForm.phone.placeholder.bn,
                      addBookingSeatForm.phone.placeholder.en
                    )}
                  />
                </InputWrapper>
                {/* gender */}
                <InputWrapper
                  error={errors?.gender?.message}
                  labelFor="gender"
                  label={translate(
                    addBookingSeatForm?.gender.label.bn,
                    addBookingSeatForm?.gender.label.en
                  )}
                >
                  <Select
                    value={watch("gender") || ""}
                    onValueChange={(value: "Male" | "Female") => {
                      setValue("gender", value);
                      setError("gender", { type: "custom", message: "" });
                    }}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue
                        placeholder={translate(
                          addBookingSeatForm.gender.placeholder.bn,
                          addBookingSeatForm.gender.placeholder.en
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">
                        {translate("পুরুষ", "Male")}
                      </SelectItem>
                      <SelectItem value="Female">
                        {translate("মহিলা ", "Female")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </InputWrapper>
                <Heading size="h4">
                  {translate("যাত্রার বিবরণ:", "Journey Details:")}
                </Heading>
                <div className="col-span-3">
                  <GridWrapper>
                    {/* BOARDING POINT */}
                    <InputWrapper
                      error={errors?.boardingPoint?.message}
                      labelFor="boardingPoint"
                      label={translate(
                        addBookingSeatForm.boardingPoint.label.bn,
                        addBookingSeatForm.boardingPoint.label.en
                      )}
                    >
                      <Select
                        onValueChange={(value: string) => {
                          setValue("boardingPoint", value);
                          setError("boardingPoint", {
                            type: "custom",
                            message: "",
                          });
                        }}
                      >
                        <SelectTrigger id="boardingPoint" className="w-full">
                          <SelectValue
                            placeholder={translate(
                              addBookingSeatForm.boardingPoint.placeholder.bn,
                              addBookingSeatForm.boardingPoint.placeholder.en
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {bookingCoach?.route?.viaRoute?.length > 0 &&
                            bookingCoach?.route?.viaRoute?.map(
                              (singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint.en}
                                  value={singlePoint?.station?.name}
                                >
                                  {formatter({
                                    type: "words",
                                    words: singlePoint?.station?.name,
                                  })}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </InputWrapper>
                    {/* DROPPING POINT */}
                    <InputWrapper
                      error={errors?.droppingPoint?.message}
                      labelFor="droppingPoint"
                      label={translate(
                        addBookingSeatForm.droppingPoint.label.bn,
                        addBookingSeatForm.droppingPoint.label.en
                      )}
                    >
                      <Select
                        onValueChange={(value: string) => {
                          setValue("droppingPoint", value);
                          setError("droppingPoint", {
                            type: "custom",
                            message: "",
                          });
                        }}
                      >
                        <SelectTrigger id="droppingPoint" className="w-full">
                          <SelectValue
                            placeholder={translate(
                              addBookingSeatForm.droppingPoint.placeholder.bn,
                              addBookingSeatForm.droppingPoint.placeholder.en
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {bookingCoach?.route?.viaRoute?.length > 0 &&
                            bookingCoach?.route?.viaRoute
                              ?.filter(
                                (target: any) =>
                                  target?.station?.name !==
                                  watch("boardingPoint")
                              )
                              ?.map((singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint.en}
                                  value={singlePoint?.station?.name}
                                >
                                  {formatter({
                                    type: "words",
                                    words: singlePoint?.station?.name,
                                  })}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </InputWrapper>
                    {/* ADDRESS */}
                    <InputWrapper
                      error={errors?.address?.message}
                      className={cn(
                        bookingFormState?.selectedSeats?.length < 3 &&
                          "col-span-1"
                      )}
                      labelFor="address"
                      label={translate(
                        addBookingSeatForm.address.label.bn,
                        addBookingSeatForm.address.label.en
                      )}
                    >
                      <Input
                        {...register("address")}
                        type="text"
                        id="address"
                        placeholder={translate(
                          addBookingSeatForm.address.placeholder.bn,
                          addBookingSeatForm.address.placeholder.en
                        )}
                      />
                    </InputWrapper>
                  </GridWrapper>
                </div>

                {/* EMAIL */}
                <InputWrapper
                  error={errors?.email?.message}
                  labelFor="email"
                  label={translate(
                    addBookingSeatForm.email.label.bn,
                    addBookingSeatForm.email.label.en
                  )}
                >
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder={translate(
                      addBookingSeatForm.email.placeholder.bn,
                      addBookingSeatForm.email.placeholder.en
                    )}
                  />
                </InputWrapper>

                {/* PASSPORT OR NID */}
                <InputWrapper
                  error={errors?.nid?.message}
                  className={cn(
                    bookingFormState?.selectedSeats?.length < 3 && "col-span-1"
                  )}
                  labelFor="pass/nid"
                  label={translate(
                    addBookingSeatForm.passportOrNID.label.bn,
                    addBookingSeatForm.passportOrNID.label.en
                  )}
                >
                  <Input
                    {...register("nid")}
                    type="text"
                    id="pass/nid"
                    placeholder={translate(
                      addBookingSeatForm.passportOrNID.placeholder.bn,
                      addBookingSeatForm.passportOrNID.placeholder.en
                    )}
                  />
                </InputWrapper>
                {/* NATIONALITY */}
                <InputWrapper
                  error={errors?.nationality?.message}
                  labelFor="nationality"
                  label={translate(
                    addBookingSeatForm.nationality.label.bn,
                    addBookingSeatForm.nationality.label.en
                  )}
                >
                  <Select
                    onValueChange={(value: string) => {
                      setValue("nationality", value);
                      setError("nationality", { type: "custom", message: "" });
                    }}
                  >
                    <SelectTrigger id="nationality" className="w-full">
                      <SelectValue
                        placeholder={translate(
                          addBookingSeatForm.nationality.label.bn,
                          addBookingSeatForm.nationality.label.en
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {nationalitiesOptions?.map(
                        (singleNationality: INationalityOptionsProps) => (
                          <SelectItem
                            key={singleNationality.en}
                            value={singleNationality.key}
                          >
                            {translate(
                              singleNationality.bn,
                              singleNationality.en
                            )}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </InputWrapper>
              </GridWrapper>
            </div>

            <div className="my-12">
              <Heading size="h4">
                {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
              </Heading>
              <div>
                {bookingFormState.selectedSeats?.length > 0 ? (
                  <VanishList
                    listItems={bookingFormState.selectedSeats}
                    handleBookingSeat={handleBookingSeat}
                  />
                ) : (
                  <div className="flex justify-center text-center">
                    <Paragraph variant="destructive" size="sm">
                      {translate(
                        "আপনি এখনো কোনো আসন নির্বাচন করেননি। বুকিং সম্পূর্ণ করতে দয়া করে একটি আসন নির্বাচন করুন।",
                        "You haven't selected a seat yet. Please choose a seat to proceed with your booking."
                      )}
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6">
              <Heading className="" size="h4">
                {translate("পেমেন্ট বিবরণ:", "Payment Details:")}
              </Heading>
            </div>

            {/* paymnet div */}
            <div className="mt-6 grid grid-cols-3">
              {/* PAYMENT METHOD */}
              <InputWrapper
                error={errors?.paymentMethod?.message}
                labelFor="paymentMethod"
                label={translate(
                  addBookingSeatForm.paymentMethod.label.bn,
                  addBookingSeatForm.paymentMethod.label.en
                )}
              >
                <Select
                  onValueChange={(value: string) => {
                    setValue("paymentMethod", value);
                    setError("paymentMethod", {
                      type: "custom",
                      message: "",
                    });
                  }}
                >
                  <SelectTrigger id="paymentMethod" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addBookingSeatForm.paymentMethod.placeholder.bn,
                        addBookingSeatForm.paymentMethod.placeholder.en
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions?.map(
                      (
                        singleNationality: IPaymentMethodOptions,
                        nationalityIndex: number
                      ) => (
                        <SelectItem
                          key={nationalityIndex}
                          value={singleNationality.key}
                        >
                          {translate(
                            singleNationality.bn,
                            singleNationality.en
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </InputWrapper>
              {/* payment type */}
              <InputWrapper
                error={errors?.paymentType?.message}
                labelFor="paymentType"
                label={translate(
                  addBookingSeatForm?.paymentType.label.bn,
                  addBookingSeatForm?.paymentType.label.en
                )}
              >
                <Select
                  value={watch("paymentType") || ""}
                  onValueChange={(value: "FULL" | "PARTIAL") => {
                    setValue("paymentType", value);
                    setError("paymentType", { type: "custom", message: "" });
                  }}
                >
                  <SelectTrigger id="paymentType" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addBookingSeatForm.paymentType.placeholder.bn,
                        addBookingSeatForm.paymentType.placeholder.en
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL">
                      {translate("পূর্ণ", "FULL")}
                    </SelectItem>
                    <SelectItem value="PARTIAL">
                      {translate("আংশিক", "PARTIAL")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </InputWrapper>
              {/* payment partial amount */}
              {paymentType === "PARTIAL" && (
                <InputWrapper
                  labelFor="paymentAmount"
                  error={errors.paymentAmount?.message}
                  label={translate(
                    addBookingSeatForm.paymentAmount.label.bn,
                    addBookingSeatForm.paymentAmount.label.en
                  )}
                >
                  <Input
                    {...register("paymentAmount")}
                    type="number"
                    id="paymentAmount"
                    placeholder={translate(
                      addBookingSeatForm.paymentAmount.placeholder.bn,
                      addBookingSeatForm.paymentAmount.placeholder.en
                    )}
                    onChange={(e) =>
                      setValue("paymentAmount", parseFloat(e.target.value))
                    }
                  />
                </InputWrapper>
              )}
            </div>
            {paymentType === "PARTIAL" && (
              <div className="flex justify-center text-center">
                <Paragraph variant="destructive" size="sm">
                  {translate(
                    "“যাত্রীকে অবশ্যই প্রস্থানের সময় কমপক্ষে 2 ঘন্টা আগে বকেয়া অর্থ প্রদান করতে হবে। অন্যথায় আপনার টিকিট বাতিল বলে বিবেচিত হবে।”",
                    "passenger must pay the due amount at least 2 hours before the departure time.Otherwise your ticket will be considered cancelled"
                  )}
                </Paragraph>
              </div>
            )}
            <div className="mt-6">
              <ul className="flex justify-between">
                <li className="text-lg tracking-tight">
                  <label>{translate("মোট আসনঃ ", "Total Seats: ")}</label>
                  <b className="font-[500]">
                    {translate(
                      convertToBnDigit(totalSeats?.toString()),
                      totalSeats?.toString()
                    )}
                  </b>
                </li>

                <li className="text-lg tracking-tight">
                  <label>{translate("প্রদত্ত বিল: ", "Paid Amount: ")}</label>
                  <b className="font-[500] font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: partialAmount?.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: partialAmount?.toString(),
                      })
                    )}
                  </b>
                </li>
                <li className="text-lg tracking-tight">
                  <label>{translate("বকেয়া বিল:", "Due Amount: ")}</label>
                  <b className="font-[500] font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: dueAmount.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: dueAmount.toString(),
                      })
                    )}
                  </b>
                </li>
                <li className="text-lg tracking-tight">
                  <label>{translate("মোট বিল: ", "Total Amount: ")}</label>
                  <b className="font-[500] font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: totalAmount?.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: totalAmount?.toString(),
                      })
                    )}
                  </b>
                </li>
              </ul>
            </div>
            <Submit
              loading={
                addBookingLoading ||
                checkingSeatLoading ||
                addBookingPaymentLoading
              }
              errors={
                addBookingError || checkingSeatError || addBookingPaymentError
              }
              submitTitle={translate("আসন বুক করুন", "Book Seat")}
              errorTitle={translate(
                "আসন বুক করতে ত্রুটি হয়েছে",
                "Seat Booking Error"
              )}
            />
          </PageTransition>
        </div>
      </form>
    </PageTransition>
  );
};

export default BookingForm;
