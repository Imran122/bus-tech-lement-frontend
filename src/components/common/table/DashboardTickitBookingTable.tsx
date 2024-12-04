import { Button } from "@/components/ui/button";
import CounterTickitBookingForm from "@/pages/dashboard/counterRole/tickit/CounterTickitBookingForm";
import { convertTimeToBengali } from "@/utils/helpers/convertTimeToBengali";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
interface IBookingTickitTableProps {
  coachData: any[];
}
const DashboardTickitBookingTable: FC<IBookingTickitTableProps> = ({
  coachData,
}: {
  coachData: any;
}) => {
  const { translate } = useCustomTranslator();
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);

  const handleToggleRow = (index: number) => {
    setOpenRowIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        <tr className="">
          <th className="border-2 border-gray-400 p-2">
            {translate("যাত্রা শুরু সময় এবং তারিখ", "Departure Time & Date")}
          </th>

          <th className="border-2 border-gray-400 p-2">
            {translate("কোচ নং", "Coach No")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("শুরুর কাউন্টার", "Starting Counter")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("শেষের কাউন্টার", "End Counter")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("নিবন্ধন নম্বর", "Registration Number")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("ভাড়া", "Fare")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("কোচের ধরণ", "Coach Type")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("বিক্রিত", "Sold")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("বুকড", "Booked")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("উপলব্ধ", "Available")}
          </th>
          <th className="border-2 border-gray-400 p-2">
            {translate("অ্যাকশন", "Actions")}
          </th>
        </tr>
      </thead>
      <tbody>
        {coachData.map((coach: any, index: any) => (
          <>
            <tr key={index} className="hover:bg-[#e074ee]">
              <td className="border border-gray-300 p-2">
                {translate(
                  `${convertTimeToBengali(coach.schedule)}`,
                  `${coach.schedule}`
                )}{" "}
                & {coach.departureDate}
              </td>

              <td className="border border-gray-300 p-2">
                {coach.coachNo || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {coach.fromCounter?.name || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {coach.destinationCounter?.name || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {coach.registrationNo || translate("N/A", "N/A")}
              </td>
              <td className="border border-gray-300 p-2">
                {formatter({
                  type: "amount",
                  amount: coach.fare?.amount || 0,
                })}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  coach.coachType === "AC"
                    ? "শীতাতপ নিয়ন্ত্রিত"
                    : "শীতাতপ নিয়ন্ত্রিত বিহীন",
                  coach.coachType === "AC" ? "Air Conditioned" : "Non-AC"
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {coach?.orderSeat?.length
                  ? translate(
                      `${convertToBnDigit(coach?.orderSeat?.length)}`,
                      coach.orderSeat?.length
                    )
                  : "0"}
              </td>
              <td className="border border-gray-300 p-2">
                {coach?.CounterBookedSeat?.length
                  ? translate(
                      `$
                    {convertToBnDigit(coach?.CounterBookedSeat?.length)}`,
                      coach.CounterBookedSeat?.length
                    )
                  : "0"}
              </td>
              <td className="border border-gray-300 p-2">
                {translate(
                  `${convertToBnDigit(coach?.seatAvailable?.toString())}`,
                  coach.seatAvailable?.toString()
                )}
              </td>
              <td className="border border-gray-300 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleRow(index)}
                >
                  {openRowIndex === index
                    ? translate("লুকান", "Hide")
                    : translate("আসন দেখুন", "View Seats")}
                </Button>
              </td>
            </tr>
            {openRowIndex === index && (
              <tr>
                <td colSpan={12} className="p-4">
                  <CounterTickitBookingForm bookingCoach={coach} />
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
    </table>
  );
};

export default DashboardTickitBookingTable;
