import React from "react";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { Paragraph } from "@/components/common/typography/Paragraph";
import QRCode from "react-qr-code";
import bus from "../../../assets/buspng.png";

interface ITickitPrintSingleProps {
  tickitData: any;
}

const TickitPrintSingle = React.forwardRef<HTMLDivElement, ITickitPrintSingleProps>(
  ({ tickitData: tickitInfo }, ref) => {
    // Generate the QR code data
    const qrData = JSON.stringify({
      phone: tickitInfo?.phone || "N/A",
      ticketNo: tickitInfo?.ticketNo || "404NOTFOUND",
      seats:
        tickitInfo?.orderSeat
          ?.map((seat: any) => seat?.seat)
          .join(", ") || "N/A",
      customerName: tickitInfo?.customerName,
      address: tickitInfo?.address,
      gender: tickitInfo?.gender,
      age: tickitInfo?.age,
      boardingPoint: tickitInfo?.boardingPoint,
      droppingPoint: tickitInfo?.droppingPoint,
      departureDate:
        tickitInfo?.orderSeat?.[0]?.coachConfig?.departureDate,
      createdAt: tickitInfo?.createdAt,
      schedule: tickitInfo?.orderSeat?.[0]?.coachConfig?.schedule,
      amount: tickitInfo?.amount,
      paymentAmount: tickitInfo?.paymentAmount,
      coachNo: tickitInfo?.orderSeat?.[0]?.coachConfig?.coachNo,
    });

    return (
      <section
        ref={ref}
        style={{
          width: "8.5in",
          height: "3.7in",
        }}
        className="flex justify-between mx-auto border-2 border-black relative"
      >
        {/* Supervisor Section */}
        <section
          style={{
            width: "2.1in",
            height: "100%",
          }}
          className="border-r-2 border-dashed border-black relative z-10"
        >
          {/* Logo */}
          <img
            src={appConfiguration?.logo}
            alt="Logo"
            className="w-20 h-auto mb-2 mx-auto"
          />

          {/* Background Image */}
          <div
            style={{
              backgroundImage: `url(${bus})`,
              backgroundSize: "80%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.1,
              zIndex: 0,
            }}
          ></div>

          <div className="relative z-10 left-7 top-0">
            <Paragraph size="sm">
              Name: {tickitInfo?.customerName}
            </Paragraph>
            <Paragraph size="sm">Mobile: {tickitInfo?.phone}</Paragraph>
            <Paragraph size="sm">
              Ticket No: {tickitInfo?.ticketNo}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Gender: {tickitInfo?.gender}
              </Paragraph>
              <Paragraph size="sm">Age: {tickitInfo?.age}</Paragraph>
            </div>
            <Paragraph size="sm">
              From: {tickitInfo?.boardingPoint}
            </Paragraph>
            <Paragraph size="sm">
              To: {tickitInfo?.droppingPoint}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time:{" "}
              {tickitInfo?.orderSeat?.[0]?.coachConfig?.schedule}
            </Paragraph>
            <Paragraph size="sm">
              Seat Fare(Tk): {tickitInfo?.paymentAmount}
            </Paragraph>
            <Paragraph size="sm">
              Seat No:{" "}
              {tickitInfo?.orderSeat
                ?.map((seat: any) => seat?.seat)
                .join(", ")}
            </Paragraph>
            <Paragraph size="sm">
              Coach No: {tickitInfo?.orderSeat?.[0]?.coachConfig?.coachNo}
            </Paragraph>
          </div>

          {/* Rotated Text */}
          <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
            <Paragraph size="sm" className="text-white font-semibold">
              Guide Copy
            </Paragraph>
          </div>

          <div className="bg-[#BE02D3] h-[44px] mt-1 w-full pl-2">
            <p className="font-semibold  text-sm text-white">
              For Online Ticket
            </p>
            <p className="text-xs text-white">
              https://iconic-beta.netlify.app/
            </p>
          </div>
        </section>

        {/* Client Section */}
        <section
          style={{
            width: "4.3in",
            height: "100%",
          }}
          className="border-r-2 border-dashed border-black relative"
        >
          <div>
            <img
              src={appConfiguration?.logo}
              alt="Logo"
              className="w-20 h-auto mx-auto"
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
          <div className="relative z-10 left-7 top-0">
            <Paragraph size="sm">
              Passenger Name: {tickitInfo?.customerName}
            </Paragraph>
            <Paragraph size="sm">
              Address: {tickitInfo?.address}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">Mobile: {tickitInfo?.phone}</Paragraph>
              <Paragraph size="sm">
                Ticket No: {tickitInfo?.ticketNo}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Gender: {tickitInfo?.gender}
              </Paragraph>
              <Paragraph size="sm">Age: {tickitInfo?.age}</Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                From: {tickitInfo?.boardingPoint}
              </Paragraph>
              <Paragraph size="sm">
                To: {tickitInfo?.droppingPoint}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Journey Dt:{" "}
                {tickitInfo?.orderSeat?.[0]?.coachConfig?.departureDate}
              </Paragraph>
              <Paragraph size="sm">
                Issue Dt:{" "}
                {tickitInfo?.createdAt
                  ? new Date(tickitInfo?.createdAt).toLocaleDateString()
                  : "N/A"}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Reporting Time:{" "}
                {tickitInfo?.orderSeat?.[0]?.coachConfig?.schedule
                  ? new Date(
                      new Date(
                        `1970-01-01T${tickitInfo?.orderSeat[0].coachConfig.schedule}`
                      ).getTime() -
                        15 * 60 * 1000
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
              </Paragraph>
              <Paragraph size="sm">
                Departure Time:{" "}
                {tickitInfo?.orderSeat?.[0]?.coachConfig?.schedule}
              </Paragraph>
            </div>

            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Seat Fare(Tk): {tickitInfo?.amount}
              </Paragraph>
              <Paragraph size="sm">
                Total Fare(Tk): {tickitInfo?.paymentAmount}
              </Paragraph>
            </div>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Seat No:{" "}
                {tickitInfo?.orderSeat
                  ?.map((seat: any) => seat?.seat)
                  .join(", ")}
              </Paragraph>
              <Paragraph size="sm">
                Coach No:{" "}
                {tickitInfo?.orderSeat?.[0]?.coachConfig?.coachNo}
              </Paragraph>
            </div>
          </div>
          {/* Rotated Text */}
          <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
            <Paragraph size="sm" className="text-white font-semibold">
              Client Copy
            </Paragraph>
          </div>
          <div className="bg-[#BE02D3] h-11 mt-1 w-full pl-2">
            <p className="font-semibold  text-sm text-white">
              Please keep your luggage under your own responsibility. Thank you.
              For Online Ticket:https://iconic-beta.netlify.app/
            </p>
          </div>
        </section>

        {/* Office Section */}
        <section
          style={{
            width: "2.1in",
            height: "100%",
          }}
          className="relative"
        >
          {/* Logo */}
          <img
            src={appConfiguration?.logo}
            alt="Logo"
            className="w-20 h-auto mb-2 mx-auto"
          />

          {/* Background Image */}
          <div
            style={{
              backgroundImage: `url(${bus})`,
              backgroundSize: "80%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0.1,
              zIndex: 0,
            }}
          ></div>

          <div className="relative z-10 left-7 top-0">
            <Paragraph size="sm">
              Name: {tickitInfo?.customerName}
            </Paragraph>
            <Paragraph size="sm">Mobile: {tickitInfo?.phone}</Paragraph>
            <Paragraph size="sm">
              Ticket No: {tickitInfo?.ticketNo}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Paragraph size="sm">
                Gender: {tickitInfo?.gender}
              </Paragraph>
              <Paragraph size="sm">Age: {tickitInfo?.age}</Paragraph>
            </div>
            <Paragraph size="sm">
              From: {tickitInfo?.boardingPoint}
            </Paragraph>
            <Paragraph size="sm">
              To: {tickitInfo?.droppingPoint}
            </Paragraph>
            <Paragraph size="sm">
              Departure Time:{" "}
              {tickitInfo?.orderSeat?.[0]?.coachConfig?.schedule}
            </Paragraph>
            <Paragraph size="sm">
              Seat Fare(Tk): {tickitInfo?.paymentAmount}
            </Paragraph>
            <Paragraph size="sm">
              Seat No:{" "}
              {tickitInfo?.orderSeat
                ?.map((seat: any) => seat?.seat)
                .join(", ")}
            </Paragraph>
            <Paragraph size="sm">
              Coach No: {tickitInfo?.orderSeat?.[0]?.coachConfig?.coachNo}
            </Paragraph>
          </div>

          {/* Rotated Text */}
          <div className="absolute z-20 bg-[#BE02D3] px-3 rounded-br-md rounded-bl-md -left-9 top-[45%] -rotate-90">
            <Paragraph size="sm" className="text-white font-semibold">
              Office Copy
            </Paragraph>
          </div>
          <div className="bg-[#BE02D3] h-[44px] mt-1 w-full pl-2">
            <p className="font-semibold  text-sm text-white">
              For Online Ticket
            </p>
            <p className="text-xs text-white">
              https://iconic-beta.netlify.app/
            </p>
          </div>
        </section>
      </section>
    );
  }
);

export default TickitPrintSingle;
