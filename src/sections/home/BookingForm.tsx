/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
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
  useGetTickitInfoByPhoneQuery,
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
import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import SeatLayoutSelector from "@/components/common/busSeatLayout/SeatLayoutSelector";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { playSound } from "@/utils/helpers/playSound";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { LuRefreshCw } from "react-icons/lu";

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
  const [phoneNumber, setPhoneNumber] = useState("");
  //
  const [bookingFormState, setBookingFormState] =
    useState<IBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });

  const [
    addBooking,
    { data: bookingInfo, isLoading: addBookingLoading, error: addBookingError },
  ] = useAddBookingMutation({}) as any;

  const [
    addBookingPayment,
    { isLoading: addBookingPaymentLoading, error: addBookingPaymentError },
  ] = useAddBookingPaymentMutation({}) as any;
  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation({}) as any;

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
  const { data: partialInfoData } = useGetPartialInfoAllQuery({});
  const paymentType = watch("paymentType"); // Watch the paymentType value
  const partialAmount = watch("paymentAmount");
  //const amount = watch("amount");

  const dueAmount = partialAmount ? totalAmount - partialAmount : 0;
  const minimumPartialPayment = useMemo(() => {
    if (partialInfoData?.data?.partialPercentage) {
      return (totalAmount * partialInfoData.data.partialPercentage) / 100;
    }
    return 0;
  }, [totalAmount, partialInfoData]);

  useEffect(() => {
    if (paymentType === "PARTIAL") {
      setValue("paymentAmount", minimumPartialPayment); // Set minimum partial payment
    }
  }, [paymentType, minimumPartialPayment, setValue]);
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
              previousAmount: bookingCoach?.discount,
            },
          ],
        }));
      }
    }
  };

  const [updateLocal, setUpdateLocal] = useState<boolean>(false);

  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (bookingInfo && updateLocal) {
      shareWithLocal("set", `${appConfiguration.appName}`, {
        bookingInfo,
      });
      setUpdateLocal(false);
    }
  }, [bookingInfo, updateLocal]);

  useEffect(() => {
    //@ts-ignore
    setValue("coachConfigId", bookingCoach?.id);
    //@ts-ignore
    setValue("schedule", bookingCoach?.schedule);
    setValue("amount", totalAmount);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);
    if (paymentType === "PARTIAL") {
      setValue("paymentAmount", dueAmount);
    }
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
  const [errorMessage, setErrorMessage] = useState("");
  //const [submitted, setSubmitted] = useState(false);
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;

  const {
    data: userInfoData,
    isLoading: userInfoLoading,
    refetch,
  } = useGetTickitInfoByPhoneQuery(phoneNumber, {
    skip: phoneNumber.length !== 11, // Skip unless phone number is 11 digits
  }) as any;
  useEffect(() => {
    if (phoneNumber.length === 11) {
      refetch(); // Trigger API call if phone number is 11 digits
    }
  }, [phoneNumber, refetch]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    await refetch(); // Trigger API call manually
  };
  useEffect(() => {
    if (userInfoData?.data) {
      // Populate all relevant form fields
      setValue("customerName", userInfoData.data.name || "");
      setValue("phone", userInfoData.data.phone || "");
      setValue("gender", userInfoData.data.gender || "");
      setValue("email", userInfoData.data.email || "");
      setValue("address", userInfoData.data.address || "");
      setValue("nationality", userInfoData.data.nationality || "");
      setValue("nid", userInfoData.data.nid || "");

      // Clear any previous error message
      setErrorMessage("");
    } else {
      // Set error message if no data found

      setErrorMessage("No data found for this phone number.");
    }

    // Reset `submitted` to allow for further searches by phone
  }, [userInfoData, setValue]);
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
      coachConfigId: bookingCoach?.id,
      schedule: bookingCoach.schedule,
      date: bookingCoach.departureDate,
      seats: cleanedData?.seats,
    });

    if (check?.data?.data?.available) {
      const finalData = {
        ...cleanedData,
        bookingType: "SeatIssue",
        seats: bookingFormState.selectedSeats.map((seat) => ({
          seat: seat?.seat,
          coachConfigId: bookingCoach?.id,
          schedule: bookingCoach.schedule,
          date: bookingCoach.departureDate,
        })),
      };

      const booking = await addBooking(finalData);

      if (booking.data?.success) {
        setUpdateLocal(true);
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
  const ResetDataOfForm = async () => {
    try {
      if (!bookingFormState.selectedSeats.length) {
        toast.warning(
          translate(
            "No seats selected to reset.",
            "রিসেট করার জন্য কোনো আসন নির্বাচন করা হয়নি।"
          )
        );
        return;
      }

      // Iterate over selected seats and call `removeBookingSeat` for each
      const promises = bookingFormState.selectedSeats.map((seat) =>
        removeBookingSeat({
          coachConfigId: bookingCoach?.id,
          date: bookingCoach?.departureDate,
          schedule: bookingCoach?.schedule,
          seat: seat.seat,
        })
      );

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      // Check if all API calls were successful
      const allSuccessful = results.every((result) => result?.data?.success);

      if (allSuccessful) {
        toast.success(
          translate(
            "All seats reset successfully.",
            "সব আসন সফলভাবে রিসেট হয়েছে।"
          )
        );

        // Reset the form state
        setBookingFormState({
          targetedSeat: null,
          selectedSeats: [],
          redirectLink: null,
          customerName: null,
          redirectConfirm: false,
        });
      } else {
        toast.error(
          translate(
            "Some seats could not be reset. Please try again.",
            "কিছু আসন রিসেট করা যায়নি। আবার চেষ্টা করুন।"
          )
        );
      }
    } catch (error) {
      console.error("Error resetting seats:", error);
      toast.error(
        translate(
          "Error resetting the seats. Please try again.",
          "আসন রিসেট করার সময় ত্রুটি হয়েছে। আবার চেষ্টা করুন।"
        )
      );
    }
  };
  return (
    <PageTransition>
      {/* find tickit */}
      <div className="md:flex  lg:justify-center justify-between lg:items-center items-center">
        <div className="lg:mt-0 md:mt-2 lg:w-[35%] md:w-4/12  flex gap-4 md:justify-end md:items-end px-6">
          <h2 className="text-primary lg:text-2xl text-lg  lg:font-semibold font-medium">
            Reset Seat
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  className="text-muted-foreground"
                  onClick={ResetDataOfForm}
                  variant="outline"
                  size="icon"
                >
                  <span className="sr-only">Refresh Button</span>
                  <LuRefreshCw className="size-[21px]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="lg:w-[65%] w-full ">
          <PageTransition>
            <form
              onSubmit={handleFormSubmit}
              className="ml-4 flex md:justify-start md:items-center"
            >
              <InputWrapper
                className="lg:w-4/12"
                labelFor="FinfTickit"
                error=" "
                label={translate(
                  "ফোন নম্বর দ্বারা টিকিট খুঁজুন",
                  "Find Ticket By Phone Number"
                )}
              >
                <Input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e: any) => setPhoneNumber(e.target.value)}
                  id="phoneNumber"
                  placeholder={translate(
                    "ফোন নম্বর দ্বারা টিকিট খুঁজুন",
                    "Find Ticket By Phone Number"
                  )}
                />
              </InputWrapper>
              <Button type="submit" className="lg:mt-7 md:mt-5 mt-9 ml-2">
                <span>
                  {userInfoLoading && (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 ..."
                      viewBox="0 0 24 24"
                    ></svg>
                  )}
                </span>
                Search
              </Button>
            </form>
            {errorMessage && (
              <div className="text-red-500 mt-1 ml-5">{errorMessage}</div>
            )}
          </PageTransition>
        </div>
      </div>

      {/*end find tickit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex md:flex-row flex-col items-start my-0 h-full mt-6 px-4 gap-x-12 ">
          {/* COUCH SEAT PLAN CONTAINER */}
          <PageTransition className="lg:w-4/12 flex items-center flex-col border-2 rounded-md justify-center  border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
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
          <PageTransition className="flex flex-col justify-between h-full lg:w-8/12">
            <div>
              <h2 className="lg:text-2xl text-lg font-semibold">
                {translate(
                  "গ্রাহকের ব্যক্তিগত তথ্য",
                  "Client Personal Information"
                )}
              </h2>

              <div className="md:grid lg:grid-cols-3 md:grid-cols-2">
                {/* NAME */}
                <InputWrapper
                  labelFor="customerName"
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
                    onChange={(e: any) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
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

                <div className="lg:col-span-3 col-span-2 py-2">
                  <h2 className="lg:text-2xl text-lg font-semibold">
                    {translate("যাত্রার বিবরণ:", "Journey Details:")}
                  </h2>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2">
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
                  </div>
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
              </div>
            </div>

            <div className="lg:my-12 my-6">
              <h2 className="lg:text-2xl text-lg font-semibold">
                {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
              </h2>
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
            <div className="lg:mt-6 mt-3">
              <h2 className="lg:text-2xl text-lg font-semibold">
                {translate("পেমেন্ট বিবরণ:", "Payment Details:")}
              </h2>
            </div>

            {/* paymnet div */}
            <div className="lg:mt-6 mt-3 md:grid lg:grid-cols-3 grid-cols-2">
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
                    value={minimumPartialPayment} // Display minimum partial payment
                    disabled={true}
                  />
                </InputWrapper>
              )}
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
            </div>
            {paymentType === "PARTIAL" && (
              <div className="flex justify-center text-center">
                <Paragraph variant="destructive" size="sm">
                  {translate(
                    `যাত্রীকে অবশ্যই প্রস্থানের সময় কমপক্ষে ${partialInfoData.data.time} আগে বকেয়া অর্থ প্রদান করতে হবে। অন্যথায় আপনার টিকিট বাতিল বলে বিবেচিত হবে।`,
                    `passenger must pay the due amount at least ${partialInfoData.data.time} before the departure time.Otherwise your ticket will be considered cancelled`
                  )}
                </Paragraph>
              </div>
            )}
            <div className="mt-6">
              <ul className="flex justify-between">
                <li className="lg:text-lg text-sm tracking-tight">
                  <label>{translate("মোট আসনঃ ", "Total Seats: ")}</label>
                  <b className="lg:font-[500] font-normal">
                    {translate(
                      convertToBnDigit(totalSeats?.toString()),
                      totalSeats?.toString()
                    )}
                  </b>
                </li>

                <li className="lg:text-lg text-sm tracking-tight">
                  <label>{translate("প্রদত্ত বিল: ", "Paid Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
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
                <li className="lg:text-lg text-sm tracking-tight">
                  <label>{translate("বকেয়া বিল:", "Due Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
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
                <li className="lg:text-lg text-sm tracking-tight">
                  <label>{translate("মোট বিল: ", "Total Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
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
