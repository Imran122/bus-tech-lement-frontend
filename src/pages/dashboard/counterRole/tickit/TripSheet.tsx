
import InfoWrapper from "@/components/common/wrapper/InfoWrapper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dynamicSeatAllocationForReport } from "@/utils/helpers/dynamicAllocationForReport";
import { FC } from "react";

interface TripStatus {
  seat: string;
  passengerName: string;
  mobile: string;
  ticketNo: string;
  fare: string;
  fromStation: string;
  toStation: string;
  issueCounterName?: string;
  orderBy?: string;
  remarks?: string;
}

interface ITripSheet {
  bookingCoach: any;
}

const TripSheet: FC<ITripSheet> = ({ bookingCoach }: any) => {
  const { logo } = appConfiguration;
  const {
    orderSeat,
    seatAvailable,
    coachClass,
    driver,
    destinationCounter,
    fromCounter,
    route,
    schedule,
    coachType,
    registrationNo,
    coachNo,
    departureDate,
  } = bookingCoach;
  console.log("bookingCoachhere: ", bookingCoach);

  // Static allocation based on coach class, with empty/default data
  const seatsAllocation = dynamicSeatAllocationForReport(coachClass).map(
    (seat: { seat: string }) => {
      const matchedOrder = orderSeat.find(
        (order: any) => order.seat === seat.seat
      );

      return {
        seat: seat.seat,
        passengerName: matchedOrder?.order?.customerName,
        mobile: matchedOrder?.order?.phone,
        ticketNo: matchedOrder?.order?.ticketNo,
        fare: matchedOrder?.order?.amount,
        fromStation: fromCounter?.name,
        toStation: destinationCounter?.name,
        issueCounterName: matchedOrder?.order?.counter?.counter?.name,
        orderBy: matchedOrder?.order?.counter?.userName,
        remarks: matchedOrder?.remarks,
      } as TripStatus;
    }
  );

  return (
    <div>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-center items-center gap-5">
          <img src={logo} alt="app logo" className="w-60" />
          {/* <Heading size={"h3"}>{appName}</Heading> */}
        </div>
      </div>
      <InfoWrapper className="my-2" heading="Trip Sheet">
        {/* BUS INFORMATION */}
        <section className="-mx-2 mb-7">
          <div className="border rounded-md overflow-hidden">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  {["Registration No", "Driver", "Guide", "Helper"].map(
                    (header, index) => (
                      <TableHead
                        className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                        key={index}
                      >
                        {header}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-center border-r">
                  <TableCell className="custom-table border-r">
                    {registrationNo}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {driver}
                  </TableCell>
                  <TableCell className="custom-table border-r">""</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* COACH INFORMATION */}
        <section className="-mx-2 mb-7">
          <div className="border rounded-md overflow-hidden">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  {[
                    "Coach No",
                    "Coach Type",
                    "Route Name",
                    "Starting Point",
                    "Ending Point",
                    "Total Sold",
                    "Total Available",
                    "Journey Date Time",
                  ].map((header, index) => (
                    <TableHead
                      className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                      key={index}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="text-center border-r">
                  <TableCell className="custom-table border-r">
                    {coachNo}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {coachType}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {route?.routeName}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {fromCounter?.address}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {destinationCounter?.address}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {orderSeat?.length}
                  </TableCell>
                  <TableCell className="custom-table border-r">
                    {seatAvailable}
                  </TableCell>
                  <TableCell className="custom-table">
                    {departureDate}, {schedule}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>

        {/* ORDERED SEAT INFORMATION */}
        <section className="-mx-2">
          <div className="border rounded-md overflow-hidden">
            <Table className="overflow-hidden">
              <TableCaption className="mt-0 border-t">
                Current trip details and passenger information
              </TableCaption>
              <TableHeader>
                <TableRow>
                  {[
                    "Seat",
                    "Passenger Name",
                    "Mobile",
                    "Ticket No",
                    "Fare",
                    "From Station",
                    "To Station",
                    "Issue Counter",
                    "Ordered By",
                    "Remarks",
                  ].map((header, index) => (
                    <TableHead
                      className="custom-table border-r !leading-4 text-center tracking-tight !text-xs"
                      key={index}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatsAllocation.map((data, index) => (
                  <TableRow className="text-center border-r" key={index}>
                    <TableCell className="custom-table border-r">
                      {data.seat}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.passengerName}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.mobile}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.ticketNo}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.fare}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data?.ticketNo && data.fromStation}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data?.ticketNo && data.toStation}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.issueCounterName && data.ticketNo
                        ? data.issueCounterName
                        : !data.issueCounterName && data.ticketNo
                        ? "Online"
                        : ""}
                    </TableCell>
                    <TableCell className="custom-table border-r">
                      {data.orderBy && data.ticketNo
                        ? data.orderBy
                        : !data.orderBy && data.ticketNo
                        ? "Online"
                        : ""}
                    </TableCell>
                    <TableCell className="custom-table">
                      {data.remarks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </InfoWrapper>
    </div>
  );
};

export default TripSheet;
