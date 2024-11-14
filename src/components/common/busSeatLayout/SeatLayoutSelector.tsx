import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { FC } from "react";
import BClassSeatLayout from "./BClassSeatLayout";
import EClassSeatLayout from "./EClassSeatLayout";
import SleeperSeatLayout from "./SleeperSeatLayout";
import SuiteClassSeatLayout from "./SuiteClassSeatLayout";

interface ISeatLayoutSelectorProps {
  coachClass: string;
  handleBookingSeat: (seatData: any) => void;
  bookingFormState: any;
  addBookingSeatLoading: boolean;
  removeBookingSeatLoading: boolean;
  checkingSeat: any;
  bookingCoach: any;
  coachId: any;
}

const SeatLayoutSelector: FC<ISeatLayoutSelectorProps> = ({
  coachClass,
  handleBookingSeat,
  bookingFormState,
  addBookingSeatLoading,
  removeBookingSeatLoading,
  checkingSeat,
  bookingCoach,
  coachId,
}) => {
  const seatsAllocation = dynamicSeatAllocation(coachClass);

  if (coachClass === "E_Class") {
    return (
      <EClassSeatLayout
        bookingCoach={bookingCoach}
        //@ts-ignore
        checkingSeat={checkingSeat}
        seatsAllocation={seatsAllocation}
        handleBookingSeat={handleBookingSeat}
        bookingFormState={bookingFormState}
        addBookingSeatLoading={addBookingSeatLoading}
        removeBookingSeatLoading={removeBookingSeatLoading}
        coachId={coachId}
      />
    );
  } else if (coachClass === "B_Class") {
    return (
      <BClassSeatLayout
        bookingCoach={bookingCoach}
        checkingSeat={checkingSeat}
        //@ts-ignore
        seatsAllocation={seatsAllocation}
        handleBookingSeat={handleBookingSeat}
        bookingFormState={bookingFormState}
        addBookingSeatLoading={addBookingSeatLoading}
        removeBookingSeatLoading={removeBookingSeatLoading}
        coachId={coachId}
      />
    );
  } else if (coachClass === "Sleeper") {
    return (
      <SleeperSeatLayout
        bookingCoach={bookingCoach}
        //@ts-ignore
        checkingSeat={checkingSeat}
        seatsAllocation={seatsAllocation}
        handleBookingSeat={handleBookingSeat}
        bookingFormState={bookingFormState}
        addBookingSeatLoading={addBookingSeatLoading}
        removeBookingSeatLoading={removeBookingSeatLoading}
      />
    );
  } else if (coachClass === "S_Class") {
    return (
      <SuiteClassSeatLayout
        bookingCoach={bookingCoach}
        //@ts-ignore
        checkingSeat={checkingSeat}
        seatsAllocation={seatsAllocation}
        handleBookingSeat={handleBookingSeat}
        bookingFormState={bookingFormState}
        addBookingSeatLoading={addBookingSeatLoading}
        removeBookingSeatLoading={removeBookingSeatLoading}
        coachId={coachId}
      />
    );
  } else {
    return null;
  }
};

export default SeatLayoutSelector;
