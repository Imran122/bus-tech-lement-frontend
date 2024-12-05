/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { useSelector } from "react-redux";
import PageTransition from "../effect/PageTransition";
interface ISeatLayoutProps {
  seatsAllocation: any[];
  handleBookingSeat: (seatData: any) => void;
  bookingFormState: any;
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  bookingCoach: any;
  coachId: any;
}

const BClassSeatLayout: FC<ISeatLayoutProps> = ({
  seatsAllocation,
  handleBookingSeat,
  bookingFormState,
  bookingCoach,
  addBookingSeatLoading,
  coachId,
}) => {
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user);
  const getSeatColorClass = (
    seatName: string,
    selected: boolean,
    bookingCoach: any,
    coachId: any
  ) => {
    const order = bookingCoach?.orderSeat?.find(
      (order: any) => order.seat === seatName
    );
    const blockedSeat = bookingCoach?.bookingSeat?.find(
      (order: any) => order.seat === seatName
    );
    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seatName
    );
    if (bookedByCounter) {
      if (!user.id) {
        return "bg-red-700 text-white";
      } else if (bookedByCounter.counter.id === user.counterId) {
        return "bg-[#A3D1D5] text-white"; // Green for seats booked by user's counter
      }
      // Otherwise, show it as orange
      return "bg-orange-500 text-white"; // Orange for seats booked by others' counters
    }

    if (blockedSeat && !selected)
      return "border-gray-800 bg-gray-800 text-white";

    const isSeatSelected = bookingFormState.selectedSeats.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seatName && selectedSeat.coachConfigId === coachId
    );

    if (isSeatSelected) return "bg-[#00BFFF] text-white";
    //if (selected) return "bg-[#00BFFF] text-white";

    if (order) {
      return order?.order?.gender === "Male"
        ? "bg-red-700 text-white"
        : "bg-[#BD06D3] text-white";
    }
    return "bg-white text-black"; // Available
  };

  const renderSeatButton = (seat: any) => {
    const isSelected = bookingFormState.selectedSeats.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seat.seat &&
        selectedSeat.coachConfigId === coachId
    );

    // Pass coachId to getSeatColorClass for coach-specific color application
    const seatStatusClass = getSeatColorClass(
      seat.seat,
      isSelected,
      bookingCoach,
      coachId
    );

    // Check if the seat is ordered or booked by another counter
    const isOrdered = bookingCoach?.orderSeat?.some(
      (order: any) => order.seat === seat.seat
    );
    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    const isBookedByOtherCounter =
      bookedByCounter && bookedByCounter.counter.id !== user.counterId;

    // Determine if the seat should be disabled
    const shouldDisableSeat = !user.role
      ? isOrdered || bookedByCounter // User role: disable ordered & all booked seats
      : isOrdered || isBookedByOtherCounter; // Counter role: disable ordered & other counters' booked seats
    //
    // Tooltip message if the seat is booked by another counter
    const tooltipText = isBookedByOtherCounter
      ? `Name: ${bookedByCounter?.user?.userName}, Address:${bookedByCounter?.counter?.address}, Phone:${bookedByCounter?.counter?.mobile}`
      : "";

    return (
      <TooltipProvider key={seat.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleBookingSeat(seat)}
              className={cn(
                "text-foreground/50 hover:text-foreground/80 size-10 relative",
                shouldDisableSeat && "cursor-not-allowed" // Add a class if disabled
              )}
              disabled={shouldDisableSeat} // Disable based on conditions above
            >
              <div
                className={cn(
                  "w-[70px] h-[40px] border px-10 py-3 rounded-md flex items-center justify-center",
                  seatStatusClass,
                  bookingFormState?.targetedSeat === seat.id &&
                    addBookingSeatLoading &&
                    "animate-pulse"
                )}
              >
                <span className="text-sm font-semibold whitespace-nowrap">
                  {seat.seat}
                </span>
              </div>
            </button>
          </TooltipTrigger>
          {user.role && tooltipText && (
            <TooltipContent>{tooltipText}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center w-full my-0 h-full mt-6 px-4 gap-x-12">
      <PageTransition className="w-full mb-5 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
        <div className="p-2 w-full">
          <div>
            <h2 className="text-center pb-1">
              {bookingCoach.coachClass === "B_Class" && "Business"} Class
            </h2>
            <ul className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-red-700 rounded-md"></span>
                <span>{translate("বিক্রয়কৃত (পুরুষ)", "Sold (Male)")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-[#BD06D3] rounded-md"></span>
                <span>{translate("বিক্রয়কৃত (মহিলা)", "Sold (Female)")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-[#00BFFF] rounded-md"></span>
                <span>{translate("নির্বাচিত", "Selected")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 border-gray-800 bg-gray-800 rounded-md"></span>
                <span>{translate("অবরুদ্ধ", "Blocked")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 bg-white text-black rounded-md"></span>
                <span>{translate("ব্যবহারযোগ্য", "Availabe")}</span>
              </li>
              <li className="flex items-center gap-x-2">
                <span className="block size-4 border-yellow-500 bg-warning/80 rounded-md"></span>
                <span>{translate("বুক করা", "Booked")}</span>
              </li>
            </ul>
          </div>
        </div>
      </PageTransition>

      <PageTransition className="w-full flex flex-col gap-3 h-full px-2">
        <div className="grid grid-cols-4 gap-x-6 pb-6 gap-y-8">
          <div className="col-span-1 grid grid-cols-1  gap-y-8">
            {
              //@ts-ignore
              seatsAllocation.left.map((seat: any) => renderSeatButton(seat))
            }
          </div>

          <div className="col-span-1 grid-cols-1 flex justify-center items-center">
            <h2 className="vertical-text  ">Ac Business Class</h2>
          </div>

          <div className="col-span-2 grid grid-cols-2 justify-items-start gap-x-[58px] gap-y-8">
            {
              //@ts-ignore
              seatsAllocation.right.map((seat: any) => renderSeatButton(seat))
            }
          </div>
        </div>

        {/* Last Row with Left, Middle, and Right Seats */}
        <div className="grid grid-cols-4 pb-6 gap-x-5 gap-y-3 ">
          <div className="grid-cols-1 col-span-1">
            {
              //@ts-ignore
              renderSeatButton(seatsAllocation.lastRow[0])
            }
          </div>

          <div className="grid-cols-1 col-span-1">
            {
              //@ts-ignore
              renderSeatButton(seatsAllocation.lastRow[1])
            }
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-x-[58px] gap-y-8">
            {
              //@ts-ignore
              renderSeatButton(seatsAllocation.lastRow[2])
            }
            {
              //@ts-ignore
              renderSeatButton(seatsAllocation.lastRow[3])
            }
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default BClassSeatLayout;
