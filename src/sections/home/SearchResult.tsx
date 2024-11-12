import BookingSeatCard from "@/components/common/card/BookingSeatCard";
import BookingSeatCardRoundTripPublic from "@/components/common/card/BookingSeatCardRoundTripPublic";
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
      {/* round trip work design */}

      <Accordion className=" w-full space-y-3" type="single" collapsible>
        {bookingState.roundTripGobookingCoachesList?.length > 0 &&
          bookingState?.roundTripGobookingCoachesList?.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCardRoundTripPublic
                setBookingState={setBookingState}
                key={coachDataIndex}
                coachData={singleCoachData}
                index={coachDataIndex}
              />
            )
          )}
      </Accordion>
      {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
        <div className="my-2 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px]">
          <h2>Return Ticket Selected</h2>
          <span className="py-3">
            <PiKeyReturnBold size={24} />
          </span>
        </div>
      )}
      <Accordion className=" w-full space-y-3" type="single" collapsible>
        {bookingState.roundTripReturnBookingCoachesList?.length > 0 &&
          bookingState?.roundTripReturnBookingCoachesList?.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCardRoundTripPublic
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
