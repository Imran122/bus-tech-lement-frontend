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
  const toggleRow = (index: number) => {
    setExpandedRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-primary text-white">
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
          {coachData.map((coach, index) => (
            <>
              <tr key={index} className="hover:bg-[#e074ee]">
                <td className="border border-gray-300 p-2">
                  {translate(
                    `${convertTimeToBengali(coach.schedule)}`,
                    coach.schedule
                  )}{" "}
                  & {coach.departureDate}
                </td>
                <td className="border border-gray-300 p-2">
                  {coach.coachNo || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(coach?.seatAvailable?.toString() || "0"),
                    coach?.seatAvailable?.toString() || "0"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(
                      coach?.CounterBookedSeat?.length?.toString() || "0"
                    ),
                    coach?.CounterBookedSeat?.length?.toString() || "0"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {translate(
                    convertToBnDigit(
                      coach?.orderSeat?.length?.toString() || "0"
                    ),
                    coach?.orderSeat?.length?.toString() || "0"
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {formatter({
                    type: "amount",
                    amount: coach.fare?.amount || 0,
                  })}
                </td>
                <td className="border border-gray-300 p-2">
                  {coach?.coachClass === "B_Class"
                    ? "Business Class"
                    : coach?.coachClass === "S_Class"
                    ? "Suite Class"
                    : coach?.coachClass === "Sleeper"
                    ? "Sleeper Coach"
                    : "Economy Class"}
                </td>
                <td className="border border-gray-300 p-2">
                  {coach.fromCounter?.name || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 p-2">
                  {coach.destinationCounter?.name || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRow(index)}
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
                    <BookingForm bookingCoach={coach} />{" "}
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
