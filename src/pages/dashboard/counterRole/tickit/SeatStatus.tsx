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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ISeatStatus {
  bookingCoach: any;
}

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

const SeatStatus: FC<ISeatStatus> = ({ bookingCoach }) => {
  const { translate } = useCustomTranslator();
  const { CounterBookedSeat, orderSeat } = bookingCoach;

  const result: ISeatStatusReport[] = [];

  orderSeat.forEach((item: any) => {
    if (item.order.counterId) {
      result.push({
        counterId: item.order.counterId,
        counterName: item.order.counter.counter.name,
        orderBy: item.order.counter.userName,
        bookSeat: "",
        soldSeat: item.seat,
        fare: item.order.fare,
        discount: item.order.discount,
        createdDate: new Date(item.createdAt),
        passengerName: item.order.customerName,
        passengerPhone: item.order.phone,
      });
    }
  });

  CounterBookedSeat.forEach((item: any) => {
    if (item.counter.id) {
      result.push({
        counterId: item.counter.id,
        counterName: item.counter.counter.name,
        orderBy: item.counter.userName,
        bookSeat: item.seat,
        soldSeat: "",
        fare: 0,
        discount: 0,
        createdDate: item.counter.counter.createdAt,
        passengerName: "",
        passengerPhone: "",
      });
    }
  });

  return (
    <div>
      <InfoWrapper
        className="my-2"
        heading={translate("কাউন্টারের অবস্থা", "Counter Booking Status")}
      >
        <section className="-mx-2">
          <div className="border rounded-md overflow-hidden">
            <Table className="overflow-hidden">
              <TableCaption className="mt-0 border-t">
                {translate(
                  "বর্তমান কাউন্টার বুকিং এবং বিক্রয় অবস্থা",
                  "Current counter booking and sales status"
                )}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  {[
                    translate("কাউন্টারের নাম", "Counter Name"),
                    translate("অর্ডার করেছেন", "Ordered By"),
                    translate("বুকড সিট নম্বর", "Booked Seat No."),
                    translate("বিক্রি সিট নম্বর", "Sold Seat No."),
                    translate("যাত্রী নাম", "Passenger Name"),
                    translate("যাত্রী ফোন", "Passenger Phone"),
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
                {result.length > 0 &&
                  result.map((status, index) => (
                    <TableRow className="text-center border-r" key={index}>
                      <TableCell className="custom-table border-r">
                        {status.counterName}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status.orderBy}
                      </TableCell>
                     

                      <TableCell className="custom-table border-r">
                        {status?.bookSeat}
                      </TableCell>

                      <TableCell className="custom-table border-r">
                        {status?.soldSeat}
                      </TableCell>
                      <TableCell className="custom-table border-r">
                        {status?.passengerName}
                      </TableCell>
                      <TableCell className="custom-table">
                        {status?.passengerPhone}
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

export default SeatStatus;
