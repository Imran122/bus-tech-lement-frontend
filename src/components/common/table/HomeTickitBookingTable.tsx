import { Button } from "@/components/ui/button";
import BookingForm from "@/sections/home/BookingForm";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";

interface IBookingTickitTableProps {
  coachData: any[];
}

const HomeTickitBookingTable: FC<IBookingTickitTableProps> = ({
  coachData,
}) => {
  const { translate } = useCustomTranslator();
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(null);

  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state

  const toggleRow = (index: number, coach: any) => {
    setExpandedRowIndex((prevIndex) => {
      const newIndex = prevIndex === index ? null : index;

      // Update shared form state with the data for the selected coach
      if (newIndex !== null) {
        setSharedFormState((prevState: any) => ({
          ...prevState,
          ...coach, // Merge with the existing data
        }));
      } else {
        setSharedFormState({}); // Clear state when collapsing
      }

      return newIndex;
    });
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary ">
            <th className="border-2 border-[#3491b1] p-2">
              {translate("যাত্রা শুরু সময়", "Departure Time")}
            </th>
            <th className="border-2 border-[#3491b1] p-2">
              {translate("কোচ নং", "Coach No")}
            </th>
            <th className="border-2 border-[#3491b1] p-2">
              {translate("উপলব্ধ", "Available")}
            </th>
            {/* <th className="border-2 border-[#3491b1] p-2">
              {translate("বুকড", "Booked")}
            </th> */}
            {/* <th className="border-2 border-[#3491b1] p-2">
              {translate("বিক্রিত", "Sold")}
            </th> */}
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
          {coachData.map((coach, index) => (
            <>
              <tr
                onClick={() => toggleRow(index, coach)}
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-[#e074ee] cursor-pointer`}
              >
                <td className="border border-gray-300 px-2 py-1">
                  {translate(
                    `${convertTimeToBengali(coach.schedule)}`,
                    coach.schedule
                  )}{" "}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {coach.coachNo || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {translate(
                    convertToBnDigit(coach?.seatAvailable?.toString() || "0"),
                    coach?.seatAvailable?.toString() || "0"
                  )}
                </td>
                {/* <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(
                      coach?.CounterBookedSeat?.length?.toString() || "0"
                    ),
                    coach?.CounterBookedSeat?.length?.toString() || "0"
                  )}
                </td> */}
                {/* <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(
                      coach?.orderSeat?.length?.toString() || "0"
                    ),
                    coach?.orderSeat?.length?.toString() || "0"
                  )}
                </td> */}
                <td className="border border-gray-300 px-2 py-1">
                  <div className="flex flex-col items-start">
                    {coach.discount > 0 && (
                      <span className="font-anek font-light text-sm line-through mb-1">
                        {translate(
                          convertToBnDigit(
                            formatter({
                              type: "amount",
                              amount: coach?.fare?.amount,
                            })
                          ),
                          formatter({
                            type: "amount",
                            amount: coach?.fare?.amount,
                          })
                        )}
                      </span>
                    )}
                    <span className="font-anek font-medium text-xl">
                      {translate(
                        convertToBnDigit(
                          formatter({
                            type: "amount",
                            amount: coach?.fare?.amount - coach.discount,
                          })
                        ),
                        formatter({
                          type: "amount",
                          amount: coach?.fare?.amount - coach.discount,
                        })
                      )}
                    </span>
                  </div>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {coach?.coachClass === "B_Class"
                    ? "Business Class"
                    : coach?.coachClass === "S_Class"
                    ? "Suite Class"
                    : coach?.coachClass === "Sleeper"
                    ? "Sleeper Coach"
                    : "Economy Class"}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {coach.fromCounter?.name || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  {coach.destinationCounter?.name || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <Button
                    variant="viewSeat"
                    size="sm"
                    onClick={(event: any) => {
                      event.stopPropagation(); // Prevent triggering parent row's onClick
                      toggleRow(index, coach);
                    }}
                  >
                    {expandedRowIndex === index
                      ? translate("লুকান", "Hide")
                      : translate("আসন দেখুন", "View Seats")}
                  </Button>
                </td>
              </tr>
              {expandedRowIndex === index && (
                <tr key={`details-${index}`}>
                  <td colSpan={10} className="p-4 border border-gray-300">
                    <BookingForm
                      bookingCoach={coach}
                      sharedFormState={sharedFormState}
                      setSharedFormState={setSharedFormState}
                    />{" "}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTickitBookingTable;
