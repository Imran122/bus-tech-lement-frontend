import { Button } from "@/components/ui/button";
import {
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useState } from "react";
import SeatLayoutSelector from "../busSeatLayout/SeatLayoutSelector";

interface IHomeRoundTripTickitTableProps {
  data: any; // Array of data for the table
  bookingFormState: any; // Current booking form state
  setBookingFormState: any; // Setter for booking form state
  setGoViaRoute: any;
  setReturnViaRoute: any;
  setBookingCoachSingle: any;
}

const HomeRoundTripTickitTable: FC<IHomeRoundTripTickitTableProps> = ({
  data,
  bookingFormState,
  setBookingFormState,
  setGoViaRoute,
  setReturnViaRoute,
  setBookingCoachSingle,
}) => {
  const { translate } = useCustomTranslator();
  const [checkingSeat] = useCheckingSeatMutation();
  const [selectedBookingCoach, setSelectedBookingCoach] = useState<any>({});
  const [openRowIndex, setOpenRowIndex] = useState<any>({});
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;
  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation();

  const handleToggleRow = (index: number, coachInfo: any) => {
    setOpenRowIndex((prevIndex: any) => (prevIndex === index ? null : index)); // Toggle index
    setSelectedBookingCoach(coachInfo);
  };

  const handleBookingSeat = async (seatData: any) => {
    try {
      const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
        (current: any) => current.seat === seatData.seat
      );

      if (isSeatAlreadySelected) {
        // Remove the seat if it's already selected
        const result = await removeBookingSeat({
          coachConfigId: selectedBookingCoach?.id,
          date: selectedBookingCoach?.departureDate,
          schedule: selectedBookingCoach?.schedule,
          seat: seatData.seat,
        });

        if (result?.data?.success) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: prevState.selectedSeats.filter(
              (seat: any) => seat.seat !== seatData.seat
            ),
          }));
        } else {
          console.error("Failed to remove seat:", result?.error);
        }
      } else {
        // Add the seat if it's not already selected
        const result = await addBookingSeat({
          coachConfigId: selectedBookingCoach?.id,
          date: selectedBookingCoach?.departureDate,
          schedule: selectedBookingCoach?.schedule,
          seat: seatData.seat,
        });

        if (result?.data?.data?.available) {
          setBookingFormState((prevState: any) => ({
            ...prevState,
            selectedSeats: [
              ...prevState.selectedSeats,
              {
                seat: seatData.seat,
                coachConfigId: selectedBookingCoach.id,
                date: selectedBookingCoach.departureDate,
                schedule: selectedBookingCoach.schedule,
                currentAmount: selectedBookingCoach?.fare?.amount,
                previousAmount: selectedBookingCoach?.discount,
              },
            ],
          }));
          setBookingCoachSingle(selectedBookingCoach); // Set only when booking successfully
        } else {
          console.error("Seat is not available or failed to book:", result);
        }
      }
    } catch (error) {
      console.error("Error handling booking seat:", error);
    }
  };

  useEffect(() => {
    if (selectedBookingCoach?.route) {
      const viaRoutes = selectedBookingCoach.route.viaRoute?.map(
        (routePoint: any) => routePoint.station.name
      );
      if (viaRoutes) {
        setGoViaRoute(viaRoutes);
        setReturnViaRoute(viaRoutes.reverse());
      }
    }
  }, [selectedBookingCoach?.route]);

  return (
    <table className="min-w-full text-center border-collapse border border-gray-300">
      <thead>
        <tr className="bg-primary ">
          <th className="border-2 border-[#3491b1] p-2">
            {translate("যাত্রা শুরু সময় এবং তারিখ", "Departure Time & Date")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("কোচ নং", "Coach No")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("উপলব্ধ", "Available")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("বুকড", "Booked")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("বিক্রিত", "Sold")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("ভাড়া", "Fare")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("কোচের ধরন", "Coach Type")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("শুরুর কাউন্টার", "Starting Counter")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("শেষের কাউন্টার", "End Counter")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("অ্যাকশন", "Actions")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: number) => (
          <>
            <tr key={index} className="hover:bg-[#e074ee]">
              <td className="border border-gray-300 p-2">
                {translate(
                  `${convertTimeToBengali(item.schedule)}`,
                  `${item.schedule}`
                )}{" "}
                & {item.departureDate}
              </td>
              <td className="border border-gray-300 p-2">
                {item.coachNo || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  `${convertToBnDigit(item?.seatAvailable?.toString())}`,
                  item.seatAvailable?.toString()
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {item?.CounterBookedSeat?.length
                  ? translate(
                      `${convertToBnDigit(item?.CounterBookedSeat?.length)}`,
                      item.CounterBookedSeat?.length
                    )
                  : "0"}
              </td>
              <td className="border border-gray-300 p-2">
                {item?.orderSeat?.length
                  ? translate(
                      `${convertToBnDigit(item?.orderSeat?.length)}`,
                      item.orderSeat?.length
                    )
                  : "0"}
              </td>
              <td className="border border-gray-300 p-2">
                {formatter({
                  type: "amount",
                  amount: item.fare?.amount || 0,
                })}
              </td>
              <td className="border border-gray-300 p-2">
                {item?.coachClass === "B_Class"
                  ? "Business Class"
                  : item?.coachClass === "S_Class"
                  ? "Suite Class"
                  : item?.coachClass === "Sleeper"
                  ? "Sleeper Coach"
                  : "Economy Class"}
              </td>
              <td className="border border-gray-300 p-2">
                {item.fromCounter?.name || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {item.destinationCounter?.name || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRow(index, item)}
                >
                  {openRowIndex === index
                    ? translate("লুকান", "Hide")
                    : translate("আসন দেখুন", "View Seats")}
                </Button>
              </td>
            </tr>
            {openRowIndex === index && (
              <tr>
                <td colSpan={10} className="p-2 text-center w-full">
                  <div className="border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] flex justify-center items-center w-[500px] mx-auto">
                    <SeatLayoutSelector
                      checkingSeat={checkingSeat}
                      coachClass={item.coachClass}
                      bookingCoach={item}
                      handleBookingSeat={handleBookingSeat}
                      bookingFormState={bookingFormState}
                      addBookingSeatLoading={addBookingSeatLoading}
                      removeBookingSeatLoading={removeBookingSeatLoading}
                      coachId={item.id}
                    />
                  </div>
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default HomeRoundTripTickitTable;
