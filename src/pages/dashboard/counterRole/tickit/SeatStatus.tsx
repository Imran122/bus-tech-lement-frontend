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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import PdfSeatStatusReport from "../../pdf/PdfSeatStatus";
import SeatStatusExel from "../../exel/SeatStatusExel";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

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
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );

  const result: ISeatStatusReport[] = [];

  orderSeat.forEach((item: any) => {
    if (item.order.counterId) {
      result.push({
        counterId: item.order.counterId,
        counterName: item.order.counter.name,
        orderBy: item.order.user.userName,
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
        counterName: item.counter.name,
        orderBy: item.user.userName,
        bookSeat: item.seat,
        soldSeat: "",
        fare: 0,
        discount: 0,
        createdDate: item.counter.createdAt,
        passengerName: "",
        passengerPhone: "",
      });
    }
  });

  return (
    <div>
       <ul className="flex space-x-3 w-full">
        <li>
          <SeatStatusExel result={result} />
        </li>

        <li>
          <PDFDownloadLink
            document={<PdfSeatStatusReport result={result} singleCms={singleCms}/>}
            fileName="seat_status_report.pdf"
          >
            
            {
            //@ts-ignore
            (params) => {
              const { loading } = params;
              return loading ? (
                <Button
                  disabled
                  className="transition-all duration-150"
                  variant="destructive"
                  size="sm"
                >
                  <Loader /> Export To Pdf
                </Button>
              ) : (
                <Button variant="destructive" size="sm">
                  Export To Pdf
                </Button>
              );
            }}
          </PDFDownloadLink>
        </li>
      </ul>
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
