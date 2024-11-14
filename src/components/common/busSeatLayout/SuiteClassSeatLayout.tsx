/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { GiSteeringWheel } from "react-icons/gi";
import { useSelector } from "react-redux";
import PageTransition from "../effect/PageTransition";
import SeatIcon from "../icon/SeatIcon";
interface ISeatLayoutProps {
  seatsAllocation: { left?: any[]; right?: any[]; middle?: any[] };
  handleBookingSeat: (seatData: any) => void;
  bookingFormState: any;
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  bookingCoach: any;
  coachId: any;
}

const SuiteClassSeatLayout: FC<ISeatLayoutProps> = ({
  seatsAllocation = { left: [], right: [], middle: [] },
  handleBookingSeat,
  bookingFormState,
  addBookingSeatLoading,
  bookingCoach,
  coachId,
}) => {
  const { translate } = useCustomTranslator();
  console.log("dddbookingCoach:--", bookingCoach);

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
      } else if (bookedByCounter.counter.id === user.id) {
        return "bg-[#A3D1D5] text-white"; // Green for seats booked by user's counter
      }
      // Otherwise, show it as orange
      return "bg-orange-500 text-white"; // Orange for seats booked by others' counters
    }
    //console.log("order:---", order);

    const isSeatSelected = bookingFormState.selectedSeats.some(
      (selectedSeat: any) =>
        selectedSeat.seat === seatName && selectedSeat.coachConfigId === coachId
    );

    if (isSeatSelected) return "bg-blue-500 text-white";

    if (blockedSeat && !selected)
      return "border-gray-800 bg-gray-800 text-white";
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
    const isOrdered = bookingCoach?.orderSeat?.some(
      (order: any) => order.seat === seat.seat
    );
    const isBlockedSeat = bookingCoach?.bookingSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    const bookedByCounter = bookingCoach?.CounterBookedSeat?.find(
      (order: any) => order.seat === seat.seat
    );
    const isBookedByOtherCounter =
      bookedByCounter && bookedByCounter.counter.id !== user.id;

    const shouldDisableSeat = !user.role
      ? isOrdered || bookedByCounter || isBlockedSeat // User role: disable ordered & all booked seats
      : isOrdered || isBookedByOtherCounter || isBlockedSeat; // Counter role: disable ordered & other counters' booked seats
    const tooltipText = isBookedByOtherCounter
      ? `Name: ${bookedByCounter?.counter?.userName}, Address:${bookedByCounter?.counter?.counter?.address}, Phone:${bookedByCounter?.counter?.counter?.phone}`
      : "";
    //console.log("isBookedByOtherCounter", isBookedByOtherCounter);
    //console.log("tooltipText:", tooltipText);
    return (
      <TooltipProvider key={seat.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleBookingSeat(seat)}
              className={cn(
                "text-foreground/50 hover:text-foreground/80 flex flex-col items-center gap-1",
                shouldDisableSeat && "cursor-not-allowed"
              )}
              disabled={shouldDisableSeat}
            >
              <div
                className={cn(
                  "w-[40px] h-[40px] rounded-md flex items-center justify-center",
                  seatStatusClass,
                  bookingFormState?.targetedSeat === seat.id &&
                    addBookingSeatLoading &&
                    "animate-pulse"
                )}
              >
                <SeatIcon className="text-gray-400 size-10" />
              </div>
              <span>{seat.seat}</span>
            </button>
          </TooltipTrigger>
          {user.role && tooltipText && (
            <TooltipContent>{tooltipText}</TooltipContent>
          )}{" "}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex flex-col justify-center items-start my-0 h-full mt-6 px-4 gap-x-12">
      <PageTransition className="w-full mb-5 flex items-center flex-col border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
        <div className="p-6 flex justify-between items-center w-full">
          <div>
            <h2 className="text-center pb-1">
              {bookingCoach.coachClass === "S_Class" && "Suite"} Class
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
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
          <div className="flex flex-col items-center">
            <GiSteeringWheel className="size-12 text-foreground opacity-80" />
            <Badge className="text-xs" size="sm" variant="outline" shape="pill">
              {translate("ড্রাইভার", "Driver")}
            </Badge>
          </div>
        </div>
      </PageTransition>

      <PageTransition className="w-full flex flex-col items-center justify-center gap-3">
        <div className=" relative grid grid-cols-4 gap-x-6 pb-3 gap-y-0">
          <div className="flex flex-col items-center gap-y-2">
            {seatsAllocation.left?.map((seat) => renderSeatButton(seat))}
          </div>

          {
            //@ts-ignore
            seatsAllocation?.middle?.length > 0 && (
              <div className="mt-[220px] mr-[30px] flex items-center justify-center">
                {
                  //@ts-ignore
                  seatsAllocation.middle.map((seat) => renderSeatButton(seat))
                }
              </div>
            )
          }

          <div className="grid  w-[150px] grid-cols-2 text-center gap-x-1 gap-y-2">
            {seatsAllocation.right?.map((seat) => renderSeatButton(seat))}
          </div>

          {/* new Divider Between Decks */}
          <div
            className="absolute top-[640px] left-0 w-full pointer-events-none z-10 flex flex-col gap-48 items-center "
            style={{ transform: "translateY(-50%)" }}
          >
            <h3 className="text-lg font-semibold mr-28 px-2 -rotate-90">
              Lower Deck
            </h3>
            <div className="w-full border-t border-primary/50 border-dashed"></div>
            <h3 className="text-lg font-semibold mr-28 px-2 -rotate-90">
              Upper Deck
            </h3>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default SuiteClassSeatLayout;
