import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

interface ISeatStatusReport {
  counterId: number;
  counterName: string;
  orderBy: string;
  cancelBy?: string;
  soldSeat?: string;
  bookSeat?: string;
  passengerName?: string;
  passengerPhone?: string;
  fare: number;
  discount: number;
  createdDate: Date;
}

interface SeatStatusExelProps {
  result: ISeatStatusReport[];
}

const SeatStatusExel: React.FC<SeatStatusExelProps> = ({ result }) => {
  // Format data for the CSV file
  const formattedData = result.map((item) => ({
    "Counter ID": item?.counterId,
    "Counter Name": item?.counterName,
    "Ordered By": item?.orderBy,
    "Booked Seat": item?.bookSeat,
    "Sold Seat": item?.soldSeat,
    "Passenger Name": item?.passengerName,
    "Passenger Phone": item?.passengerPhone,
    Fare: item?.fare || 0,
    Discount: item?.discount || 0,
    "Created Date": item?.createdDate.toLocaleString(),
  }));

  return (
    <CSVLink
      data={formattedData}
      filename={`${appConfiguration.appName}_SeatStatusReport.csv`}
      className="text-sm"
    >
      <Button variant="outline" size="sm">
        Export to Excel
      </Button>
    </CSVLink>
  );
};

export default SeatStatusExel;
