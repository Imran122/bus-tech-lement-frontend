import BookingSeatCard from "@/components/common/card/BookingSeatCard";
import { Accordion } from "@/components/ui/accordion";
import { PiKeyReturnBold } from "react-icons/pi";

export default function SearchResult({
  bookingState,
  setBookingState,
}: {
  bookingState: any;
  setBookingState: any;
}) {
  console.log("booking search result", bookingState);
  return (
    <div>
      <Accordion className=" w-full space-y-3" type="single" collapsible>
        {bookingState.bookingCoachesList?.length > 0 &&
          bookingState?.bookingCoachesList?.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCard
                setBookingState={setBookingState}
                key={coachDataIndex}
                coachData={singleCoachData}
                index={coachDataIndex}
              />
            )
          )}
      </Accordion>
      <div className="my-2 flex justify-center items-center border-2 rounded-md border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px]">
        <span className="py-3">
          <PiKeyReturnBold size={24} />
        </span>
      </div>
      <Accordion className=" w-full space-y-3" type="single" collapsible>
        {bookingState.returnBookingCoachesList?.length > 0 &&
          bookingState?.returnBookingCoachesList?.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCard
                setBookingState={setBookingState}
                key={coachDataIndex}
                coachData={singleCoachData}
                index={coachDataIndex}
              />
            )
          )}
      </Accordion>
    </div>
  );
}
