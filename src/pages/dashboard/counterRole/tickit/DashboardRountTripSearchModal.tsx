import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
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
import { closeModal } from "@/store/api/user/coachConfigModalSlice";
import { format } from "date-fns";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";

interface IDashboardRountTripSearchModalProps {
  bookingState: any;
  setBookingState: any;
  countersData: any[];
}

const DashboardRountTripSearchModal: FC<
  IDashboardRountTripSearchModalProps
> = ({ bookingState, setBookingState, countersData }) => {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    fromCounterId: bookingState.fromCounterId || null,
    destinationCounterId: bookingState.destinationCounterId || null,
    coachType: bookingState.coachType || "",
    date: bookingState.date || null,
    returnDate: bookingState.returnDate || null,
  });
  const handleSubmit = () => {
    if (
      !formState.fromCounterId ||
      !formState.destinationCounterId ||
      !formState.coachType ||
      !formState.date ||
      !formState.returnDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const formattedReturnDate = format(formState.returnDate, "yyyy-MM-dd");

    setBookingState({
      ...bookingState,
      ...formState,
      returnDate: formattedReturnDate,
      orderType: "Round_Trip",
    });

    dispatch(closeModal());
  };

  return (
    <div className="text-black">
      <h2 className="text-xl font-bold mb-4">Round Trip Details</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Starting Counter */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Starting Counter</label>
          <Select
            value={formState.fromCounterId?.toString() || ""}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                fromCounterId: +value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Starting Counter" />
            </SelectTrigger>
            <SelectContent>
              {countersData?.map((counter: any) => (
                <SelectItem key={counter.id} value={counter.id.toString()}>
                  {counter.name}
                </SelectItem>
              ))}
              {!countersData?.length && <SelectSkeleton />}
            </SelectContent>
          </Select>
        </div>

        {/* Ending Counter */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Ending Counter</label>
          <Select
            value={formState.destinationCounterId?.toString() || ""}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                destinationCounterId: +value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Ending Counter" />
            </SelectTrigger>
            <SelectContent>
              {countersData
                ?.filter(
                  (counter: any) => counter.id !== formState.fromCounterId
                )
                ?.map((counter: any) => (
                  <SelectItem key={counter.id} value={counter.id.toString()}>
                    {counter.name}
                  </SelectItem>
                ))}
              {!countersData?.length && <SelectSkeleton />}
            </SelectContent>
          </Select>
        </div>

        {/* Coach Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Coach Type</label>
          <Select
            value={formState.coachType}
            onValueChange={(value: string) =>
              setFormState((prev) => ({
                ...prev,
                coachType: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Coach Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Air Condition</SelectItem>
              <SelectItem value="NON AC">Without Air Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Going Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Going Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full text-left">
                {formState.date
                  ? format(new Date(formState.date), "dd/MM/yyyy")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={formState.date ? new Date(formState.date) : undefined}
                onSelect={(date) =>
                  setFormState((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : null,
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Return Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full text-left">
                {formState.returnDate
                  ? format(new Date(formState.returnDate), "dd/MM/yyyy")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={
                  formState.returnDate
                    ? new Date(formState.returnDate)
                    : undefined
                }
                onSelect={(date) =>
                  setFormState((prev) => ({
                    ...prev,
                    returnDate: date ? date.toISOString() : null,
                  }))
                }
                disabled={(date) =>
                  formState.date && date < new Date(formState.date)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => dispatch(closeModal())}
          className="mr-4"
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default DashboardRountTripSearchModal;
