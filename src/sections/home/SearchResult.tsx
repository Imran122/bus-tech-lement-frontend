import BookingSeatCard from "@/components/common/card/BookingSeatCard";
import { Accordion } from "@/components/ui/accordion";

export default function SearchResult({ bookingState, setBookingState }:{bookingState:any,setBookingState:any}) {
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
    </div>
  );
}
