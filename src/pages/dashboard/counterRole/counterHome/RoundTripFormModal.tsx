/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Heading } from "@/components/common/typography/Heading";
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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useReactToPrint } from "react-to-print";

import PageTransition from "@/components/common/effect/PageTransition";
import Submit from "@/components/common/form/Submit";
import { VanishList } from "@/components/common/form/VanishList";
import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  useAddBookingMutation,
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useRemoveBookingSeatMutation,
  useUnBookSeatFromCounterBookingMutation,
} from "@/store/api/bookingApi";
import {
  counterPaymentMethodOptions,
  ICounterPaymentMethodOptions,
} from "@/utils/constants/common/paymentMethodOptions";

import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Label } from "@/components/common/typography/Label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addBookingSeatFromCounterProps,
  addBookingSeatFromCounterSchema,
} from "@/schemas/counter/addBookingSeatFromCounter";
import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { format } from "date-fns";
import { LuRefreshCw } from "react-icons/lu";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import TickitPrint from "../../printLabel/TickitPrint";
import SeatStatus from "../tickit/SeatStatus";
import Status from "../tickit/Status";
import TripSheet from "../tickit/TripSheet";

interface ICounterBookingFormProps {
  bookingCoach: any;
  onClose: any;
  goViaRoute: any;
  returnViaRoute: any;
  bookingFormState: any;
  setBookingFormState: any;
}

const RoundTripFormModal: FC<ICounterBookingFormProps> = ({
  bookingCoach,
  onClose,
  goViaRoute,
  returnViaRoute,
  bookingFormState,
  setBookingFormState,
}) => {
  const [bookingType, setBookingType] = useState("SeatIssue");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    undefined
  );
  const [expirationTime, setExpirationTime] = useState<Date>(new Date());
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);
  const [status, setStatus] = useState(false);
  const [statusBookingCoach, setStatusBookingCoach] = useState({
    CounterBookedSeat: [],
    orderSeat: [],
  });
  const [tripSheet, setTripSheet] = useState(false);

  const [seatStatus, setSeatStatus] = useState(false);
  const [seatStatusBooking, setSeatStatusBooking] = useState({
    CounterBookedSeat: [],
    orderSeat: [],
  });

  // REFERENCE FOR PRINT SELECTED COMPONENT
  const printSaleRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  // const [clear, setClear] = useState(false);
  const [saleData, setSaleData] = useState<any>();
  const [updateLocal, setUpdateLocal] = useState<boolean>(false);

  const [removeBookingSeat] = useRemoveBookingSeatMutation({}) as any;
  const [unBookSeatFromCounterBooking] =
    useUnBookSeatFromCounterBookingMutation({}) as any;
  const { data: partialData } = useGetPartialInfoAllQuery({});
  const [
    addBooking,
    {
      data: saleInfo,
      isLoading: addBookingLoading,
      isSuccess: addBookingSuccess,
      error: addBookingError,
    },
  ] = useAddBookingMutation();
  const [
    checkingSeat,
    { isLoading: checkingSeatLoading, error: checkingSeatError },
  ] = useCheckingSeatMutation();
  const [addBookingSeat] = useAddBookingSeatMutation();

  const totalAmount =
    totalCalculator(bookingFormState?.selectedSeats, "currentAmount") || 0;
  const totalSeats = bookingFormState?.selectedSeats?.length || 0;

  // STORE PROMISE RESOLVE REFERENCE
  const promiseResolveRef = useRef<any>(null);

  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }

    if (saleInfo && updateLocal) {
      shareWithLocal("set", `${appConfiguration.appCode}`, {
        saleInfo,
      });
      setUpdateLocal(false);
    }
  }, [isPrinting, saleInfo, updateLocal]);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_${saleInfo?.data?.ticketNo}`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // RESET THE PROMISE RESOLVE SO WE CAN PRINT AGAIN
      promiseResolveRef.current = null;
      setIsPrinting(false);
      // setClear(false);
      setSaleData({});
    },
  });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<addBookingSeatFromCounterProps>({
    resolver: zodResolver(addBookingSeatFromCounterSchema),
    defaultValues: {
      counterId: undefined,
      customerName: "",
      paymentType: "", // For dropdowns, empty string is a good default for unselected state
      paymentAmount: undefined,
      gender: "Male", // Use undefined instead of empty string for optional enum fields
      phone: "",
      email: "",
      address: "",
      nid: "",
      nationality: undefined, // Dropdown reset value
      paymentMethod: undefined, // Dropdown reset value
      boardingPoint: undefined, // Dropdown reset value
      droppingPoint: undefined,
      returnDroppingPoint: undefined, // Dropdown reset value
      returnBoardingPoint: undefined, // Dropdown reset value
      noOfSeat: 0,
      amount: 0,
      date: bookingCoach?.departureDate || "", // Pre-fill if available
      seats: [],
    },
  });

  useEffect(() => {
    if (bookingCoach) {
      setStatusBookingCoach({
        CounterBookedSeat: bookingCoach?.CounterBookedSeat,
        orderSeat: bookingCoach?.orderSeat,
      });
    }

    setSeatStatusBooking({
      CounterBookedSeat: bookingCoach?.CounterBookedSeat,
      orderSeat: bookingCoach?.orderSeat,
    });
  }, [bookingCoach]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        counterId: undefined,
        customerName: "",
        paymentType: "",
        paymentAmount: undefined,
        gender: "Male", // Reset to undefined for optional enum
        phone: "",
        email: "",
        address: "",
        nid: "",
        nationality: undefined, // Dropdown reset to undefined
        paymentMethod: undefined, // Dropdown reset to undefined
        boardingPoint: undefined, // Dropdown reset to undefined
        droppingPoint: undefined, // Dropdown reset to undefined
        noOfSeat: 0,
        amount: 0,
        date: bookingCoach?.departureDate || "",
        seats: [],
      });
      setBookingFormState({
        targetedSeat: null,
        selectedSeats: [],
        redirectLink: null,
        customerName: null,
        redirectConfirm: false,
      });
      setBookingType("SeatIssue");
      setExpirationDate(undefined);
      setExpirationTime(new Date());
    }
  }, [isSubmitSuccessful, reset, bookingCoach?.departureDate]);
  const handleBookingSeat = async (seatData: any) => {
    const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
      (current: any) => current.seat === seatData.seat
    );

    if (isSeatAlreadySelected) {
      // Remove the seat
      const result = await removeBookingSeat({
        coachConfigId: bookingCoach?.id,
        date: bookingCoach?.departureDate,
        schedule: bookingCoach?.schedule,
        seat: seatData?.seat,
      });

      if (result?.data?.success) {
        setBookingFormState((prevState: any) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat: any) => seat.seat !== seatData.seat
          ),
        }));
      }
    } else {
      // Add the seat
      const result = await addBookingSeat({
        coachConfigId: bookingCoach?.id,
        date: bookingCoach?.departureDate,
        schedule: bookingCoach?.schedule,
        seat: seatData?.seat,
      });

      if (result?.data?.data?.available) {
        setBookingFormState((prevState: any) => ({
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

  useEffect(() => {
    setValue("amount", totalAmount);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);
    setValue("counterId", user?.id);

    if (bookingFormState?.selectedSeats?.length) {
      setValue(
        "seats",
        bookingFormState.selectedSeats.map((singleSeat: any) => singleSeat.seat)
      );
    }
  }, [
    bookingCoach,
    bookingFormState.selectedSeats,
    setValue,
    totalAmount,
    totalSeats,
    user.id,
  ]);
  //
  //
  //
  const paymentType = watch("paymentType");
  const partialAmount = watch("paymentAmount");
  //@ts-ignore
  const paymentMethod = watch("paymentMethod");
  const dueAmount = partialAmount ? totalAmount - partialAmount : 0;

  const handleCancelBooking = async () => {
    // Define the data structure for seats to cancel
    const data = {
      seats: bookingFormState.selectedSeats.map((seat: any) => ({
        seat: seat.seat,
        coachConfigId: bookingCoach.id,
        schedule: bookingCoach.schedule,
        date: bookingCoach.departureDate,
      })),
    };

    try {
      // Call the unbook API with the prepared data
      const response = await unBookSeatFromCounterBooking(data).unwrap();

      if (response.success) {
        setBookingFormState((prevState: any) => ({
          ...prevState,
          selectedSeats: [], // Clear selected seats on successful cancellation
        }));
        toast.success(
          translate(
            "Booking canceled successfully.",
            "বুকিং সফলভাবে বাতিল করা হয়েছে।"
          )
        );
      }
    } catch (error) {
      console.error(
        translate(
          "Failed to cancel booking:",
          "বুকিং বাতিল করতে ব্যর্থ হয়েছে:"
        ),
        error
      );
      toast.error(
        translate(
          "Failed to cancel booking.",
          "বুকিং বাতিল করতে ব্যর্থ হয়েছে।"
        )
      );
    }
  };
  const ResetDataOfForm = async () => {
    try {
      if (!bookingFormState.selectedSeats.length) {
        toast.warning(
          translate(
            "No seats selected to reset.",
            "রিসেট করার জন্য কোন আসন নির্বাচন করা হয়নি"
          )
        );
        return;
      }

      const promises = bookingFormState.selectedSeats.map((seat: any) =>
        removeBookingSeat({
          coachConfigId: seat?.coachConfigId,
          date: seat?.date,
          schedule: seat?.schedule,
          seat: seat.seat,
        })
      );

      const results = await Promise.all(promises);

      const allSuccessful = results.every((result) => result?.data?.success);
      if (allSuccessful) {
        toast.success(
          translate(
            "All seats reset successfully.",
            "সমস্ত আসন সফলভাবে পুনরায় সেট করা হয়েছে৷"
          )
        );
        setBookingFormState({
          selectedSeats: [],
          targetedSeat: null,
          redirectLink: null,
          customerName: null,
          redirectConfirm: false,
        });
      } else {
        toast.error(
          translate(
            "Some seats could not be reset. Try again.",
            "কিছু আসন রিসেট করা যায়নি। আবার চেষ্টা করুন"
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        translate("Error resetting the seats.", "আসন রিসেট করার সময় ত্রুটি")
      );
    }
  };
  //on submit
  const onSubmit = async (data: addBookingSeatFromCounterProps) => {
    const cleanedData = removeFalsyProperties(data, [
      "customerName",
      "nid",
      "email",
      "nationality",
      "address",
    ]);

    try {
      const check = await checkingSeat({
        coachConfigId: bookingCoach.id,
        schedule: bookingCoach.schedule,
        date: bookingCoach.departureDate,
        seats: cleanedData?.seats,
      });

      if (check?.data?.data?.available) {
        const finalData = {
          ...cleanedData,
          bookingType: bookingType,
          seats: bookingFormState.selectedSeats.map((seat: any) => ({
            seat: seat.seat,
            coachConfigId: bookingCoach.id,
            schedule: bookingCoach.schedule,
            date: bookingCoach.departureDate,
          })),
          ...(bookingType === "SeatBooking" && {
            expiryBookingDate: expirationDate
              ? format(expirationDate, "yyyy-MM-dd")
              : undefined,
            expiryBookingTime: expirationTime
              ? expirationTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined,
          }),
        };
        //
        const booking = await addBooking(finalData);

        if (booking.data?.success) {
          setUpdateLocal(true);
          // AFTER COMPLETE THE ADDING SALE CALL TO PRINT
          if (bookingType !== "SeatBooking") {
            handlePrint();
          }
          onClose();
          // setClear(true);
          toast.success(
            translate(
              `প্রিয় ${booking.data?.data?.customerName}, আপনার সিট সফলভাবে বুক করা হয়েছে! আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ।`,
              `Dear ${booking.data?.data?.customerName}, your seat has been successfully booked! Thank you for choosing our service.`
            )
          );
        } else {
          toast.error("Booking failed. Please try again.");
        }
      } else {
        toast.warning("Selected seat is no longer available.");
      }
    } catch (error) {
      toast.error("An error occurred during booking submission.");
      console.error("Error:", error);
    }
  };
  const invoiceReprintHandler = () => {
    // AFTER COMPLETE THE ADDING SALE CALL TO PRINT
    const data = shareWithLocal("get", `${appConfiguration.appCode}`);
    setSaleData(data);
    handlePrint();
  };
  const formValues = watch();
  return (
    <section className=" w-full">
      <PageTransition>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* seat issue or seat booking part counter */}
          <PageTransition className="flex py-5 lg:flex-row flex-col gap-6 items-center justify-center h-full w-full">
            <RadioGroup
              className="flex lg:flex-row flex-row gap-4 mt-8"
              value={bookingType}
              onValueChange={setBookingType} // Update bookingType state on change
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SeatIssue" id="r2" />
                <Label htmlFor="r2">Seat Issue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SeatBooking" id="r3" />
                <Label htmlFor="r3">Seat Booking</Label>
              </div>
            </RadioGroup>
            {bookingType === "SeatBooking" && (
              <div className="flex items-center justify-center gap-4 lg:mt-9">
                <h2 className="text-red-500 text-lg">
                  This coach's booking seat expire Date{" "}
                  {bookingCoach.departureDate} before departure time of{" "}
                  {partialData?.data?.counterBookingTime}
                </h2>
              </div>
            )}
          </PageTransition>

          <div className="flex items-center gap-5 mx-3">
            {/* STATUS BUTTON */}
            <Dialog
              open={status}
              onOpenChange={(open: boolean) => setStatus(open)}
            >
              <DialogTrigger asChild>
                <Button
                  className="group relative px-10"
                  variant="default"
                  size="icon"
                >
                  <span className="">{translate("অবস্থা", "Status")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogTitle className="sr-only">status</DialogTitle>
                <Status bookingCoach={statusBookingCoach} />
              </DialogContent>
            </Dialog>

            {/* STRIP SHEET BUTTON */}
            <Dialog
              open={tripSheet}
              onOpenChange={(open: boolean) => setTripSheet(open)}
            >
              <DialogTrigger asChild>
                <Button
                  className="group relative px-14"
                  variant="outline"
                  size="icon"
                >
                  <span className="">
                    {translate("ট্রিপ তালিকার ", "Trip Sheet")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent size="xl">
                <DialogTitle className="sr-only">Strip sheet</DialogTitle>
                <TripSheet bookingCoach={bookingCoach} />
              </DialogContent>
            </Dialog>

            {/* SEAT STATUS */}
            <Dialog
              open={seatStatus}
              onOpenChange={(open: boolean) => setSeatStatus(open)}
            >
              <DialogTrigger asChild>
                <Button
                  className="group relative px-14"
                  variant="destructive"
                  size="icon"
                >
                  <span className="">
                    {translate("আসন অবস্থা", "Seat Status")}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent size="xl">
                <DialogTitle className="sr-only">seat status</DialogTitle>
                <SeatStatus bookingCoach={seatStatusBooking} />
              </DialogContent>
            </Dialog>
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

          {/* seat issue or seat booking part counter */}
          <div className="lg:flex flex-row items-start my-0 h-full mt-6 px-4 gap-x-12 ">
            {/* CUSTOMER & PAYMENT INFORMATION */}
            <PageTransition className="flex flex-col justify-between h-full ">
              <div>
                <Heading size="h4">
                  {translate(
                    "গ্রাহকের ব্যক্তিগত তথ্য",
                    "Client Personal Information"
                  )}
                </Heading>
                <div className="grid lg:grid-cols-3 md:grid-cols-2">
                  {/* NAME */}
                  <InputWrapper
                    className={cn(
                      bookingFormState?.selectedSeats?.length < 3 &&
                        "col-span-1"
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
                            {goViaRoute.length > 0 &&
                              goViaRoute?.map((singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint.en}
                                  value={singlePoint}
                                >
                                  {formatter({
                                    type: "words",
                                    words: singlePoint,
                                  })}
                                </SelectItem>
                              ))}
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
                            {returnViaRoute.length > 0 &&
                              returnViaRoute
                                ?.filter(
                                  (target: any) =>
                                    target?.station?.name !==
                                    watch("boardingPoint")
                                )
                                ?.map((singlePoint: any) => (
                                  <SelectItem
                                    key={singlePoint.en}
                                    value={singlePoint}
                                  >
                                    {formatter({
                                      type: "words",
                                      words: singlePoint,
                                    })}
                                  </SelectItem>
                                ))}
                          </SelectContent>
                        </Select>
                      </InputWrapper>
                      {/* BOARDING POINT */}
                      <InputWrapper
                        error={errors?.returnBoardingPoint?.message}
                        labelFor="returnBoardingPoint"
                        label={translate(
                          addBookingSeatForm.returnBoardingPoint.label.bn,
                          addBookingSeatForm.returnBoardingPoint.label.en
                        )}
                      >
                        <Select
                          onValueChange={(value: string) => {
                            setValue("returnBoardingPoint", value);
                            setError("returnBoardingPoint", {
                              type: "custom",
                              message: "",
                            });
                          }}
                        >
                          <SelectTrigger
                            id="returnBoardingPoint"
                            className="w-full"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.returnBoardingPoint
                                  .placeholder.bn,
                                addBookingSeatForm.returnBoardingPoint
                                  .placeholder.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {goViaRoute.length > 0 &&
                              goViaRoute?.map((singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint.en}
                                  value={singlePoint}
                                >
                                  {formatter({
                                    type: "words",
                                    words: singlePoint,
                                  })}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </InputWrapper>
                      {/* DROPPING POINT */}
                      <InputWrapper
                        error={errors?.returnDroppingPoint?.message}
                        labelFor="returnDroppingPoint"
                        label={translate(
                          addBookingSeatForm.returnDroppingPoint.label.bn,
                          addBookingSeatForm.returnDroppingPoint.label.en
                        )}
                      >
                        <Select
                          onValueChange={(value: string) => {
                            setValue("returnDroppingPoint", value);
                            setError("returnDroppingPoint", {
                              type: "custom",
                              message: "",
                            });
                          }}
                        >
                          <SelectTrigger
                            id="returnDroppingPoint"
                            className="w-full"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.returnDroppingPoint
                                  .placeholder.bn,
                                addBookingSeatForm.returnDroppingPoint
                                  .placeholder.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {returnViaRoute.length > 0 &&
                              returnViaRoute
                                ?.filter(
                                  (target: any) =>
                                    target?.station?.name !==
                                    watch("boardingPoint")
                                )
                                ?.map((singlePoint: any) => (
                                  <SelectItem
                                    key={singlePoint.en}
                                    value={singlePoint}
                                  >
                                    {formatter({
                                      type: "words",
                                      words: singlePoint,
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
                      value={watch("nationality") || ""}
                      onValueChange={(value: string) => {
                        setValue("nationality", value);
                        setError("nationality", {
                          type: "custom",
                          message: "",
                        });
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
                  {/* PASSPORT OR NID */}
                  <InputWrapper
                    error={errors?.nid?.message}
                    className={cn(
                      bookingFormState?.selectedSeats?.length < 3 &&
                        "col-span-1"
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
                </div>
              </div>

              <div className="mt-6">
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
              {/* PAYMENT METHOD */}
              <Heading className="mt-6" size="h4">
                {translate("পেমেন্ট বিবরণ:", "Payment Details:")}
              </Heading>
              <div className="grid lg:grid-cols-3 md:grid-cols-2">
                <InputWrapper
                  error={errors?.paymentMethod?.message}
                  labelFor="paymentMethod"
                  label={translate(
                    addBookingSeatForm.paymentMethod.label.bn,
                    addBookingSeatForm.paymentMethod.label.en
                  )}
                >
                  <Select
                    value={watch("paymentMethod") || ""}
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
                      {counterPaymentMethodOptions?.map(
                        (
                          singleNationality: ICounterPaymentMethodOptions,
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

              <div className="flex justify-end items-center gap-5 mt-8">
                <Button
                  onClick={handleCancelBooking}
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  {translate("বুকিং বাতিল করুন", "Restore Seat")}
                </Button>

                <Submit
                  loading={addBookingLoading || checkingSeatLoading}
                  errors={addBookingError || checkingSeatError}
                  submitTitle={translate("আসন বুক করুন", "Book Seat")}
                  errorTitle={translate(
                    "আসন বুক করতে ত্রুটি হয়েছে",
                    "Seat Booking Error"
                  )}
                  className="py-0 my-0"
                />

                <div className="mt-">
                  <Button
                    onClick={() => invoiceReprintHandler()}
                    type="button"
                    variant="default"
                    size="sm"
                  >
                    Reprint
                  </Button>
                </div>
              </div>
            </PageTransition>
          </div>
        </form>
      </PageTransition>
      <div className="invisible hidden -left-full">
        {addBookingSuccess && (
          <TickitPrint ref={printSaleRef} tickitData={saleInfo} />
        )}
        {saleData && bookingType !== "SeatBooking" && (
          <TickitPrint ref={printSaleRef} tickitData={saleData?.saleInfo} />
        )}
      </div>
    </section>
  );
};

export default RoundTripFormModal;
