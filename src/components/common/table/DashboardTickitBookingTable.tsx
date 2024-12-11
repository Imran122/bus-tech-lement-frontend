import { Button } from "@/components/ui/button";
import LocationOfCounter from "@/components/ui/LoactionOfCounter";
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

  const [sharedFormState, setSharedFormState] = useState<any>({}); // Renamed state

  const toggleRow = (index: number, coach: any) => {
    setOpenRowIndex((prevIndex) => {
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
    <table className="min-w-full border-collapse text-center border border-gray-300">
      <thead>
        <tr className="bg-primary text-white">
          <th className="border-2 border-[#3491b1] p-2">
            {translate("যাত্রা শুরু সময়", "Departure Time")}
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
            {translate("নিবন্ধন নম্বর", "Registration Number")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("শুরুর কাউন্টার", "Starting Counter")}
          </th>
          <th className="border-2 border-[#3491b1] p-2">
            {translate("শেষের কাউন্টার", "End Counter")}
          </th>

          {/* <th className="border-2 border-[#3491b1] p-2">
            {translate("কোচের ধরণ", "Coach Type")}
          </th> */}

          <th className="border-2 border-[#3491b1] p-2">
            {translate("অ্যাকশন", "Actions")}
          </th>
        </tr>
      </thead>
      <tbody>
        {coachData.length !== 0 ? (
          coachData.map((coach: any, index: any) => (
            <>
              <tr
                onClick={() => toggleRow(index, coach)}
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } hover:bg-[#e074ee] cursor-pointer`}
              >
                <td className="border border-gray-300 py-1 px-2">
                  {translate(
                    `${convertTimeToBengali(coach.schedule)}`,
                    `${coach.schedule}`
                  )}{" "}
                </td>
                <td className="border border-gray-300 flex gap-1 py-1 px-2">
                  {coach.coachNo || translate("N/A", "N/A")}

                  <LocationOfCounter viaRoute={coach.route?.viaRoute} />
                </td>{" "}
                <td className="border border-gray-300 py-1 px-2">
                  {translate(
                    `${convertToBnDigit(coach?.seatAvailable?.toString())}`,
                    coach.seatAvailable?.toString()
                  )}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {coach?.CounterBookedSeat?.length
                    ? translate(
                        `$
                    {convertToBnDigit(coach?.CounterBookedSeat?.length)}`,
                        coach.CounterBookedSeat?.length
                      )
                    : "0"}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {coach?.orderSeat?.length
                    ? translate(
                        `${convertToBnDigit(coach?.orderSeat?.length)}`,
                        coach.orderSeat?.length
                      )
                    : "0"}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {formatter({
                    type: "amount",
                    amount: coach.fare?.amount || 0,
                  })}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {coach.registrationNo || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {coach.fromCounter?.name || translate("N/A", "N/A")}
                </td>
                <td className="border border-gray-300 py-1 px-2">
                  {coach.destinationCounter?.name || translate("N/A", "N/A")}
                </td>
                {/* <td className="border border-gray-300 p-2">
                {translate(
                  coach.coachType === "AC"
                    ? "শীতাতপ নিয়ন্ত্রিত"
                    : "শীতাতপ নিয়ন্ত্রিত বিহীন",
                  coach.coachType === "AC" ? "Air Conditioned" : "Non-AC"
                )}
              </td> */}
                <td className="border border-gray-300 px-2 py-1">
                  <Button
                    className=""
                    variant="viewSeat"
                    size="sm"
                    onClick={(event: any) => {
                      event.stopPropagation(); // Prevent triggering parent row's onClick
                      toggleRow(index, coach);
                    }}
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
                    <CounterTickitBookingForm
                      sharedFormState={sharedFormState}
                      setSharedFormState={setSharedFormState}
                      bookingCoach={coach}
                    />
                  </td>
                </tr>
              )}
            </>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="p-4 text-center text-red-500">
              {translate("কোনো তথ্য নেই", "No Data available")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DashboardTickitBookingTable;
