import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import QRCode from "react-qr-code";
import bus from "../../../assets/buspng.png";
import { Heading } from "@/components/common/typography/Heading";

interface ITickitPrintClientProps {
  tickitData: any;
  logo: any;
}

const TickitPrintClient = React.forwardRef<
  HTMLDivElement,
  ITickitPrintClientProps
>(({ tickitData: tickitInfo, logo }, ref) => {
  const calculateReportingTime = (schedule: string | undefined): string => {
    if (!schedule || typeof schedule !== "string") {
      console.error("Invalid schedule provided:", schedule);
      return "Invalid time"; // Fallback for invalid schedule
    }

    const [time, period] = schedule.split(" ");
    if (!time || !period) {
      console.error("Malformed schedule:", schedule);
      return "Invalid time"; // Fallback for malformed input
    }

    const [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format if necessary
    let departureHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    if (period === "AM" && hours === 12) departureHours = 0; // Handle midnight case

    // Create a Date object for the schedule time
    const departureTime = new Date();
    departureTime.setHours(departureHours, minutes, 0, 0);

    // Subtract 15 minutes
    const reportingTime = new Date(departureTime.getTime() - 15 * 60 * 1000);

    // Format the reporting time back to a readable string
    const reportingHours = reportingTime.getHours() % 12 || 12; // Convert to 12-hour format
    const reportingMinutes = reportingTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const reportingPeriod = reportingTime.getHours() >= 12 ? "PM" : "AM";

    return `${reportingHours}:${reportingMinutes} ${reportingPeriod}`;
  };

  // Generate the QR code data
  const qrData = JSON.stringify({
    phone: tickitInfo?.data?.phone || "N/A",
    ticketNo: tickitInfo?.data?.ticketNo || "404NOTFOUND",
    seats:
      tickitInfo?.data?.orderSeat?.map((seat: any) => seat?.seat).join(", ") ||
      "N/A",
    customerName: tickitInfo?.data?.customerName,
    address: tickitInfo?.data?.address,
    gender: tickitInfo?.data?.gender,
    age: tickitInfo?.data?.age,
    boardingPoint: tickitInfo?.data?.boardingPoint,
    droppingPoint: tickitInfo?.data?.droppingPoint,
    departureDate: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.departureDate,
    createdAt: tickitInfo?.data?.createdAt,
    schedule: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.schedule,
    amount: tickitInfo?.data?.amount,
    paymentAmount: tickitInfo?.data?.paymentAmount,
    coachNo: tickitInfo?.data?.orderSeat?.[0]?.coachConfig?.coachNo,
  });

  const returnSeatNo = tickitInfo?.data?.orderSeat?.filter(
    (s: any) => s.date === tickitInfo?.data?.returnDate
  );

  const seatNo = tickitInfo?.data?.orderSeat?.filter(
    (s: any) => s.date === tickitInfo?.data?.date
  );

  return (
    <section
      ref={ref}
      style={{
        width: "5in",
        height: "5.5in",
      }}
      className="flex justify-center mx-auto border-2 border-black relative"
    >
      {/* Client Section */}
      <section className="relative">
        <div>
          <img
            src={logo?.companyLogoBangla}
            alt="Logo"
            className="w-32 h-auto mx-auto"
          />
          <Paragraph size={"sm"} className="font-bold pb-2 text-center">
            {" "}
            Hot line: 01945518927
          </Paragraph>
        </div>
        <div className="absolute top-2 right-5">
          <QRCode value={qrData} size={80} />
        </div>
        <div
          style={{
            backgroundImage: `url(${bus})`,
            backgroundSize: "50%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundColor: "rgba(190, 2, 211, 0.1)",
            zIndex: 0,
          }}
        ></div>
        {/* Content */}
        <div className="relative z-10 left-5 top-0">
          <Paragraph size="sm">
            Passenger Name: {tickitInfo?.data?.customerName}
          </Paragraph>
          <Paragraph size="sm">Address: {tickitInfo?.data?.address}</Paragraph>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">Mobile: {tickitInfo?.data?.phone}</Paragraph>
            <Paragraph size="sm">
              Ticket No: {tickitInfo?.data?.ticketNo}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Seat No:{" "}
              {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
            </Paragraph>
            <Paragraph size="sm">
              Coach No: {seatNo?.[0]?.coachConfig?.coachNo}
            </Paragraph>
          </div>
          <Paragraph size="sm">Gender: {tickitInfo?.data?.gender}</Paragraph>

          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              From: {tickitInfo?.data?.boardingPoint}
            </Paragraph>
            <Paragraph size="sm">
              To: {tickitInfo?.data?.droppingPoint}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Journey Dt: {seatNo?.[0]?.coachConfig?.departureDate}
            </Paragraph>
            <Paragraph size="sm">
              Issue Dt:{" "}
              {tickitInfo?.data?.createdAt
                ? new Date(tickitInfo.data.createdAt).toLocaleDateString()
                : "N/A"}
            </Paragraph>
          </div>
          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Reporting Time:{" "}
              {calculateReportingTime(seatNo?.[0]?.coachConfig?.schedule)}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time: {seatNo?.[0]?.coachConfig?.schedule}
            </Paragraph>
          </div>

          <div className="flex gap-2 items-center">
            <Paragraph size="sm">
              Seat Fare(Tk): {seatNo?.[0]?.unitPrice}
            </Paragraph>
            <Paragraph size="sm">
              Total Fare(Tk): {tickitInfo?.data?.paymentAmount}
            </Paragraph>
          </div>

          {/* RETURN TICKET INFO */}
          {tickitInfo?.data?.orderType === "Round_Trip" && (
            <div>
              <Heading className="py-3" size={"h5"}>
                Return Seat Info
              </Heading>
              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Coach No:{returnSeatNo?.[0]?.coachConfig?.coachNo}
                </Paragraph>
                <Paragraph size="sm">
                  Seat No:{" "}
                  {returnSeatNo?.map((seat: any) => seat?.seat).join(", ") ||
                    "N/A"}
                </Paragraph>
              </div>

              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  From: {tickitInfo?.data?.returnBoardingPoint}
                </Paragraph>
                <Paragraph size="sm">
                  To: {tickitInfo?.data?.returnDroppingPoint}
                </Paragraph>
              </div>
              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Journey Dt: {tickitInfo?.data?.returnDate}
                </Paragraph>
                <Paragraph size="sm">
                  Issue Dt:{" "}
                  {tickitInfo?.data?.createdAt
                    ? new Date(tickitInfo.data.createdAt).toLocaleDateString()
                    : "N/A"}
                </Paragraph>
              </div>
              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Reporting Time:{" "}
                  {calculateReportingTime(
                    returnSeatNo?.[0]?.coachConfig?.schedule
                  )}
                </Paragraph>
                <Paragraph size="sm">
                  Departure Time: {returnSeatNo?.[0]?.coachConfig?.schedule}
                </Paragraph>
              </div>

              <div className="flex gap-2 items-center">
                <Paragraph size="sm">
                  Seat Fare(Tk): {returnSeatNo?.[0]?.unitPrice}
                </Paragraph>
                <Paragraph size="sm">
                  Total Fare(Tk): {tickitInfo?.data?.paymentAmount}
                </Paragraph>
              </div>
            </div>
          )}
        </div>
        {/* Rotated Text */}
        <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-14 top-[45%] -rotate-90">
          <Paragraph size="sm" className="text-white font-semibold">
            Client Copy
          </Paragraph>
        </div>
      </section>
      <div className="bg-[#BE02D3] absolute mt-1 w-full pl-2 bottom-0">
        <p className="font-semibold  text-sm text-white">
          Please keep your luggage under your own responsibility. Thank you. For
          Online Ticket:https://iconic-beta.netlify.app/
        </p>
      </div>
    </section>
  );
});

export default TickitPrintClient;
