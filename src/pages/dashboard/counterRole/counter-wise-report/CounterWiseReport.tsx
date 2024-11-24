import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSupervisorCoachDetailsQuery } from "@/store/api/superviosr/supervisorExpenseApi";
import { useGetModalCoachInfoByDateQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CounterWiseReport() {
  const today = new Date();
  const user = useSelector((state: any) => state.user); // Access logged-in user data
  const [calendarOpen, setCalendarOpen] = useState(false);
  //const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [localData, setLocalData] = useState<any[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [filteredCounterData, setFilteredCounterData] = useState<any | null>(
    null
  );

  // Fetch coaches based on the selected date
  const { data: todaysCoachInfo, isLoading: isTodaysCoachLoading } =
    useGetModalCoachInfoByDateQuery(
      format(selectedDate || today, "yyyy-MM-dd")
    );

  // Fetch report data for the selected coach
  const { data: reportsData, isLoading: reportLoading } =
    useGetSupervisorCoachDetailsQuery(selectedCoachId || 0);
  useEffect(() => {
    if (todaysCoachInfo?.data) {
      setLocalData(todaysCoachInfo.data);
    }
  }, [todaysCoachInfo]);

  useEffect(() => {
    if (reportsData?.data?.counterWiseReport) {
      const counterData = reportsData.data.counterWiseReport.find(
        (counter: any) => counter.counterId === user?.counterId
      );
      setFilteredCounterData(counterData || null);
    }
  }, [reportsData, user]);

  if (isTodaysCoachLoading || reportLoading) {
    return <DetailsSkeleton />;
  }
  return (
    <FormWrapper
      heading="Counter-Wise Report"
      subHeading="View counter-wise details for the selected coach."
    >
      <div className="flex gap-5">
        {/* Date Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "yyyy-MM-dd")
                  : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={selectedDate || new Date()}
                onSelect={(date) => {
                  setSelectedDate(date ?? null); // Handle undefined by setting to null
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Coach Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Coach</label>
          <Select
            value={selectedCoachId?.toString() || undefined}
            onValueChange={(value) => setSelectedCoachId(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Coach" />
            </SelectTrigger>
            <SelectContent>
              {localData.map((coach: any) => (
                <SelectItem key={coach.id} value={coach.id.toString()}>
                  {coach.coachNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Display */}
      {filteredCounterData && (
        <div className="mt-4">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Coach No</th>
                <th className="border px-4 py-2">Total Seat</th>
                <th className="border px-4 py-2">Total Taka</th>
                <th className="border px-4 py-2">Commission (Tk)</th>
                <th className="border px-4 py-2">Payable Amount (Tk)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border px-4 py-2">
                  {reportsData?.data?.coachInfo?.coachNo || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {filteredCounterData.totalSeat || 0}
                </td>
                <td className="border px-4 py-2">
                  {filteredCounterData.totalAmount || 0}
                </td>
                <td className="border px-4 py-2">
                  {filteredCounterData.commission || 0}
                </td>
                <td className="border px-4 py-2">
                  {filteredCounterData.totalAmount -
                    filteredCounterData.commission || 0}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Additional Table for Passenger Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Passenger Name</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Seats Booked</th>
                  <th className="border px-4 py-2">Sold By</th>
                </tr>
              </thead>
              <tbody>
                {filteredCounterData.orderDetails.map(
                  (order: any, index: number) => (
                    <tr key={index} className="text-center">
                      <td className="border px-4 py-2">
                        {order.customerName || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {order.phone || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {order.orderSeat
                          .map((seat: any) => seat.seat)
                          .join(", ")}
                      </td>
                      <td className="border px-4 py-2">
                        {order.user?.userName}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!filteredCounterData && (
        <div className="mt-4 text-red-500 text-center">
          No data available for your counter.
        </div>
      )}
    </FormWrapper>
  );
}
