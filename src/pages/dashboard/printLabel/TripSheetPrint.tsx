import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
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
import React from "react";

interface ITripSheetPrintProps {
  bookingCoach: any;
  selectedTables: {
    tripSheet: boolean;
    coachDetails: boolean;
    passengerInfo: boolean;
  };
}
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

const TripSheetPrint = React.forwardRef<HTMLDivElement, ITripSheetPrintProps>(
  ({ bookingCoach, selectedTables }, ref) => {
    const { logo } = appConfiguration;
    const currentDateTime = new Date().toLocaleString();
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
      helper,
    } = bookingCoach;
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
      <section ref={ref}>
        <section className="w-full h-full break-after-page text-black font-anek mx-auto px-[40px] pt-[30px] pb-[10px]">
          <div className="grid grid-cols-3 justify-items-center items-end w-full">
            <div></div>
            <img src={logo} alt="app logo" className="w-60" />
            <div className="flex flex-col justify-end -mr-14">
              <Paragraph size={"sm"}>
                Printing By: {bookingCoach?.order?.counter?.userName}
              </Paragraph>
              <Paragraph size={"sm"}>Date & Time: {currentDateTime}</Paragraph>
            </div>
          </div>
          {/* Trip Sheet Table */}
          {selectedTables.tripSheet && (
            <div>
              <div>
                <Heading size={"h5"} className="text-center">
                  Bus Information
                </Heading>
              </div>
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
                        <TableCell className="custom-table border-r">
                          ""
                        </TableCell>
                        <TableCell className="custom-table">{helper}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>
            </div>
          )}

          {/* Coach Details Table */}
          {selectedTables.coachDetails && (
            <div>
              <div>
                <Heading size={"h5"} className="text-center">
                  Coach Details
                </Heading>
              </div>
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
            </div>
          )}

          {/* Passenger Info Table */}
          {selectedTables.passengerInfo && (
            <div>
              <div>
                <Heading size={"h5"} className="text-center">
                  Passanger Information
                </Heading>
              </div>
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
            </div>
          )}
        </section>
      </section>
    );
  }
);

export default TripSheetPrint;
