/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INationalityOptionsProps,
  nationalitiesOptions,
} from "@/utils/constants/common/nationalitiesOptions";
import { addBookingSeatForm } from "@/utils/constants/form/addBookingForm";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useReactToPrint } from "react-to-print";

import PageTransition from "@/components/common/effect/PageTransition";
import Submit from "@/components/common/form/Submit";
import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  useAddBookingMutation,
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useGetTickitInfoByPhoneQuery,
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
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import SeatLayoutSelector from "@/components/common/busSeatLayout/SeatLayoutSelector";

import { VanishListTable } from "@/components/common/form/VanishListTable";
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
import SeatStatus from "./SeatStatus";
import Status from "./Status";
import TripSheet from "./TripSheet";

interface ICounterBookingFormProps {
  bookingCoach: any;
  sharedFormState: any; // Renamed state
  setSharedFormState: (formState: any) => void;
}
export interface ICounterBookingFormStateProps {
  targetedSeat: number | null;
  selectedSeats: any[];

  redirectLink: string | null;
  customerName: string | null;
  redirectConfirm: boolean;
}

const CounterTickitBookingForm: FC<ICounterBookingFormProps> = ({
  bookingCoach,
  sharedFormState,
  setSharedFormState,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
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

  //const [popoverOpen, setPopoverOpen] = useState(false);
  const [bookingFormState, setBookingFormState] =
    useState<ICounterBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;
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
  const seatsAllocation = (() => {
    switch (bookingCoach.coachClass) {
      case "E_Class":
      case "B_Class":
      case "Sleeper":
      case "S_Class":
        return dynamicSeatAllocation(bookingCoach?.CoachConfigSeats);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  })();

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

    watch,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<addBookingSeatFromCounterProps>({
    resolver: zodResolver(addBookingSeatFromCounterSchema),
    defaultValues: useMemo(() => sharedFormState, [sharedFormState]),
  });
  const {
    data: userInfoData,

    refetch,
  } = useGetTickitInfoByPhoneQuery(phoneNumber, {
    skip: phoneNumber.length !== 11, // Skip unless phone number is 11 digits
  }) as any;
  useEffect(() => {
    if (phoneNumber.length === 11) {
      refetch(); // Trigger API call if phone number is 11 digits
    }
  }, [phoneNumber, refetch]);
  const handleFieldUpdate = (fieldName: string, value: any) => {
    setSharedFormState((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
    setValue(fieldName as keyof addBookingSeatFromCounterProps, value);
  };
  useEffect(() => {
    if (userInfoData?.data) {
      const {
        name,
        phone,
        gender,
        email,
        address,
        nationality,
        nid,
        boardingPoint,
        droppingPoint,
      } = userInfoData.data;

      const updatedFields = {
        customerName: name || "",
        phone: phone || "",
        gender: gender || "",
        email: email || "",
        address: address || "",
        nationality: nationality || "",
        nid: nid || "",
        boardingPoint: boardingPoint || "",
        droppingPoint: droppingPoint || "",
      };

      setSharedFormState((prevState: any) => ({
        ...prevState,
        ...updatedFields,
      }));

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key as keyof addBookingSeatFromCounterProps, value);
      });
    }
  }, [userInfoData, setValue, setSharedFormState]);
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
      seats: bookingFormState.selectedSeats.map((seat) => ({
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
        setBookingFormState((prevState) => ({
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
          seats: bookingFormState.selectedSeats.map((seat) => ({
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

  return (
    <section>
      <PageTransition>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 py-10 ">
              {/* seat status trip sheet seat status section */}
              <div className="flex items-center gap-2  mb-3">
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
              {/* COUCH SEAT PLAN CONTAINER */}
              <PageTransition className="w-full flex items-center flex-col border-2 rounded-md justify-center  border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
                <SeatLayoutSelector
                  checkingSeat={checkingSeat}
                  bookingCoach={bookingCoach}
                  coachClass={bookingCoach.coachClass}
                  //@ts-ignore
                  seatsAllocation={seatsAllocation}
                  handleBookingSeat={handleBookingSeat}
                  bookingFormState={bookingFormState}
                  removeBookingSeatLoading={removeBookingSeatLoading}
                />
              </PageTransition>
            </div>
            <div className="col-span-7 py-10 px-2 w-full ">
              <div className="relative w-full  border-2">
                <h2 className="absolute border border-[#e57bf3] -top-3 left-2   px-2 bg-[#e074ee]">
                  {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
                </h2>
                <div className="px-3  h-[250px] overflow-y-scroll">
                  <div className="mt-6">
                    <div>
                      {bookingFormState.selectedSeats?.length > 0 ? (
                        <VanishListTable
                          listItems={bookingFormState.selectedSeats
                            .slice()
                            .reverse()}
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
                </div>
              </div>

              {/* seat issue or seat booking part counter */}
              <div className="flex border-2 my-1 flex-col items-center justify-center w-full">
                <RadioGroup
                  className="flex flex-row justify-center items-center gap-4 py-3"
                  value={bookingType}
                  onValueChange={setBookingType} // Update bookingType state on change
                >
                  <div className="flex items-cente space-x-2">
                    <RadioGroupItem value="SeatIssue" id="r2" />
                    <Label htmlFor="r2">Seat Issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SeatBooking" id="r3" />
                    <Label htmlFor="r3">Seat Booking</Label>
                  </div>
                </RadioGroup>
                {bookingType === "SeatBooking" && (
                  <div className="flex items-center justify-center gap-4">
                    <h2 className="text-red-500 text-lg">
                      This coach's booking seat expire Date{" "}
                      {bookingCoach.departureDate} before departure time of{" "}
                      {partialData?.data?.counterBookingTime}
                    </h2>
                  </div>
                )}
              </div>
              {/* CUSTOMER & PAYMENT INFORMATION */}

              <div className="border-2 mt-4 relative py-10 px-1">
                <h2 className="absolute border border-[#e57bf3] -top-3 left-2  px-2 bg-[#e074ee]">
                  {translate(
                    "গ্রাহকের ব্যক্তিগত তথ্য",
                    "Client Personal Information"
                  )}
                </h2>

                <div className="w-full py-8">
                  <table className="table-auto border-collapse border  w-full">
                    <tbody className="text-[13px]">
                      {/* Row 1: Name and Phone */}
                      <tr className="border ">
                        <td className="border  p-2 font-medium">
                          {translate("নাম", "Name")}
                        </td>
                        <td className="border  p-2">
                          <Input
                            {...register("customerName")}
                            value={sharedFormState.customerName || ""}
                            onChange={(e) =>
                              handleFieldUpdate("customerName", e.target.value)
                            }
                            type="text"
                            id="name"
                            placeholder={translate(
                              addBookingSeatForm.name.placeholder.bn,
                              addBookingSeatForm.name.placeholder.en
                            )}
                            className="w-full"
                          />
                          {errors.customerName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.customerName.message}
                            </p>
                          )}
                        </td>
                        <td className="border  p-2 font-medium">
                          {translate("ফোন ✼", "Phone ✼")}
                        </td>
                        <td className="border  p-2">
                          <Input
                            {...register("phone")}
                            value={sharedFormState.phone || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setPhoneNumber(value);
                              handleFieldUpdate("phone", value);
                            }}
                            type="tel"
                            id="phone"
                            placeholder={translate(
                              addBookingSeatForm.phone.placeholder.bn,
                              addBookingSeatForm.phone.placeholder.en
                            )}
                            className="w-full"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.phone.message}
                            </p>
                          )}
                        </td>
                      </tr>

                      {/* Row 2: Gender and Email */}
                      <tr className="border ">
                        <td className="border  p-2 font-medium">
                          {translate("লিঙ্গ", "Gender")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.gender || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("gender", value)
                            }
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
                                {translate("মহিলা", "Female")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border  p-2 font-medium">
                          {translate("ইমেইল", "Email")}
                        </td>
                        <td className="border  p-2">
                          <Input
                            {...register("email")}
                            value={sharedFormState.email || ""}
                            onChange={(e) =>
                              handleFieldUpdate("email", e.target.value)
                            }
                            type="email"
                            id="email"
                            placeholder={translate(
                              addBookingSeatForm.email.placeholder.bn,
                              addBookingSeatForm.email.placeholder.en
                            )}
                            className="w-full"
                          />
                        </td>
                      </tr>

                      {/* Row 3: Nationality and Passport/NID */}
                      <tr className="border ">
                        <td className="border  p-2 font-medium">
                          {translate("জাতীয়তা", "Nationality")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.nationality || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("nationality", value)
                            }
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
                                (
                                  singleNationality: INationalityOptionsProps
                                ) => (
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
                        </td>
                        <td className="border  p-2 font-medium">
                          {translate("পাসপোর্ট বা এনআইডি", "Passport/NID")}
                        </td>
                        <td className="border  p-2">
                          <Input
                            {...register("nid")}
                            value={sharedFormState.nid || ""}
                            onChange={(e) =>
                              handleFieldUpdate("nid", e.target.value)
                            }
                            type="text"
                            id="pass/nid"
                            placeholder={translate(
                              addBookingSeatForm.passportOrNID.placeholder.bn,
                              addBookingSeatForm.passportOrNID.placeholder.en
                            )}
                            className="w-full"
                          />
                        </td>
                      </tr>

                      {/* Row 4: Address */}
                      <tr className="border ">
                        <td className="border  p-2 font-medium">
                          {translate("ঠিকানা", "Address")}
                        </td>
                        <td colSpan={3} className="border  p-2">
                          <Input
                            {...register("address")}
                            value={sharedFormState.address || ""}
                            onChange={(e) =>
                              handleFieldUpdate("address", e.target.value)
                            }
                            type="text"
                            id="address"
                            placeholder={translate(
                              addBookingSeatForm.address.placeholder.bn,
                              addBookingSeatForm.address.placeholder.en
                            )}
                            className="w-full"
                          />
                        </td>
                      </tr>

                      {/* Row 5: Boarding and Dropping Point */}
                      <tr className="border ">
                        <td className="border  p-2 font-medium">
                          {translate("বোর্ডিং পয়েন্ট ✼", "Boarding Point ✼")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.boardingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("boardingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="boardingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  addBookingSeatForm.boardingPoint.placeholder
                                    .bn,
                                  addBookingSeatForm.boardingPoint.placeholder
                                    .en
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingCoach?.route?.viaRoute?.map(
                                (singlePoint: any) => (
                                  <SelectItem
                                    key={singlePoint?.station?.name}
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
                          {errors.boardingPoint && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.boardingPoint.message}
                            </p>
                          )}
                        </td>
                        <td className="border  p-2 font-medium">
                          {translate("ড্রপিং পয়েন্ট ✼", "Drop Point ✼")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.droppingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("droppingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="droppingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  addBookingSeatForm.droppingPoint.placeholder
                                    .bn,
                                  addBookingSeatForm.droppingPoint.placeholder
                                    .en
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {bookingCoach?.route?.viaRoute
                                ?.filter(
                                  (target: any) =>
                                    target?.station?.name !==
                                    watch("boardingPoint")
                                )
                                .map((singlePoint: any) => (
                                  <SelectItem
                                    key={singlePoint?.station?.name}
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
                          {errors.droppingPoint && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.droppingPoint.message}
                            </p>
                          )}
                        </td>
                      </tr>
                      {/* PAYMENT METHOD */}
                      {/* Row 6: Payment Method and Payment Type */}
                      <tr className="border ">
                        <td className="border p-2 font-medium">
                          {translate("পেমেন্ট পদ্ধতি ✼", "Pay Method ✼")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.paymentMethod || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("paymentMethod", value)
                            }
                          >
                            <SelectTrigger
                              id="paymentMethod"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  addBookingSeatForm.paymentMethod.placeholder
                                    .bn,
                                  addBookingSeatForm.paymentMethod.placeholder
                                    .en
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {counterPaymentMethodOptions?.map(
                                (
                                  singleNationality: ICounterPaymentMethodOptions,
                                  index
                                ) => (
                                  <SelectItem
                                    key={index}
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
                          {errors.paymentMethod && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.paymentMethod.message}
                            </p>
                          )}
                        </td>
                        <td className="border  p-2 font-medium">
                          {translate("পেমেন্ট টাইপ ✼", "Payment Type ✼")}
                        </td>
                        <td className="border  p-2">
                          <Select
                            value={sharedFormState.paymentType || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("paymentType", value)
                            }
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
                          {errors.paymentType && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.paymentType.message}
                            </p>
                          )}
                        </td>
                      </tr>

                      {/* Row 7: Payment Partial Amount (if PARTIAL is selected) */}
                      {paymentType === "PARTIAL" && (
                        <tr className="border ">
                          <td className="border  p-2 font-medium">
                            {translate(
                              "আংশিক অর্থের পরিমাণ ✼",
                              "Partial Payment Amount ✼"
                            )}
                          </td>
                          <td colSpan={3} className="border 0 p-2">
                            <Input
                              {...register("paymentAmount")}
                              type="number"
                              id="paymentAmount"
                              placeholder={translate(
                                addBookingSeatForm.paymentAmount.placeholder.bn,
                                addBookingSeatForm.paymentAmount.placeholder.en
                              )}
                              className="w-full"
                              onChange={(e) =>
                                setValue(
                                  "paymentAmount",
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                            {errors.paymentAmount && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.paymentAmount.message}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

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
                      <label>
                        {translate("প্রদত্ত বিল: ", "Paid Amount: ")}
                      </label>
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
                    variant="default"
                  >
                    {translate("রিসেট", "Reset")}
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
              </div>
            </div>
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

export default CounterTickitBookingForm;
