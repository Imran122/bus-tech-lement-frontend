import BookingSeatCard from "@/components/common/card/BookingSeatCard";
import BookingSeatCardRoundTripPublic from "@/components/common/card/BookingSeatCardRoundTripPublic";
import { Accordion } from "@/components/ui/accordion";
import { useState } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import BoookingFormRoundTripPublic, {
  IBookingFormStateProps,
} from "./BoookingFormRoundTripPublic";

export default function SearchResult({
  bookingState,
  setBookingState,
}: {
  bookingState: any;
  setBookingState: any;
}) {
  const [bookingFormState, setBookingFormState] =
    useState<IBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingCoachSingle, setBookingCoachSingle] = useState({});
  const [goViaRoute, setGoViaRoute] = useState([]);
  const [returnViaRoute, setReturnViaRoute] = useState([]);

  // Open and close modal
  const handleProceedClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle redirect to payment after booking is successful
  if (bookingFormState.redirectConfirm && bookingFormState.redirectLink) {
    window.location.href = bookingFormState.redirectLink;
  }

  return (
    <div>
      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState.bookingCoachesList?.length > 0 &&
          bookingState.bookingCoachesList.map(
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

      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState.roundTripGobookingCoachesList?.length > 0 &&
          bookingState.roundTripGobookingCoachesList.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCardRoundTripPublic
                setBookingState={setBookingState}
                key={coachDataIndex}
                coachData={singleCoachData}
                index={coachDataIndex}
                bookingFormState={bookingFormState}
                setBookingFormState={setBookingFormState}
                setGoViaRoute={setGoViaRoute}
                setReturnViaRoute={setReturnViaRoute}
                setBookingCoachSingle={setBookingCoachSingle}
                bookingCoachSingle={bookingCoachSingle}
              />
            )
          )}
      </Accordion>

      {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
        <div className="my-10 px-3 flex justify-start items-center gap-5 border-2 rounded-md border-green-500/50 border-dashed bg-primary/5 backdrop-blur-[2px]">
          <h2 className="font-bold text-green-400 text-2xl">
            Select Return Ticket
          </h2>
          <span className="py-3">
            <PiKeyReturnBold size={24} />
          </span>
        </div>
      )}

      <Accordion className="w-full space-y-3" type="single" collapsible>
        {bookingState.roundTripReturnBookingCoachesList?.length > 0 &&
          bookingState.roundTripReturnBookingCoachesList.map(
            (singleCoachData: any, coachDataIndex: number) => (
              <BookingSeatCardRoundTripPublic
                setBookingState={setBookingState}
                key={coachDataIndex}
                coachData={singleCoachData}
                index={coachDataIndex}
                bookingFormState={bookingFormState}
                setBookingFormState={setBookingFormState}
                setGoViaRoute={setGoViaRoute}
                setReturnViaRoute={setReturnViaRoute}
                setBookingCoachSingle={setBookingCoachSingle}
                bookingCoachSingle={bookingCoachSingle}
              />
            )
          )}
      </Accordion>

      {bookingState.roundTripReturnBookingCoachesList?.length > 0 && (
        <div className="w-full mt-5 max-w-xs text-center">
          <button
            onClick={handleProceedClick}
            className="block px-6 py-3 text-xl bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Proceed
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="border-primary/50 border-dashed bg-background backdrop-blur-[2px] duration-300 rounded-lg p-8 w-full max-w-3xl">
            <button
              onClick={handleCloseModal}
              className="text-red-500 font-bold mb-4"
            >
              Close
            </button>
            <BoookingFormRoundTripPublic
              goViaRoute={goViaRoute}
              bookingCoach={bookingCoachSingle}
              returnViaRoute={returnViaRoute}
              bookingFormState={bookingFormState}
              setBookingFormState={setBookingFormState}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
