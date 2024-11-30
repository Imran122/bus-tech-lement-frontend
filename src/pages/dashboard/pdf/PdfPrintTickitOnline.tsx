import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import QRCode from "react-qr-code";
import bus from "../../../assets/buspng.png";

const styles = StyleSheet.create({
  page: {
    width: 900,
    height: 1100,
    position: "relative",
    backgroundColor: "#ffffff",
    padding: 130,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover", // Ensures the image scales properly
    opacity: 0.1, // Make the background image semi-transparent
    zIndex: -1, // Push the image behind other content
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 40,
    marginBottom: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 12,
  },
  section: {
    flexDirection: "column",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start", // Corrected from "left" to "flex-start"
    paddingRight: 10,
    marginBottom: 5,
  },
  col: {
    flexDirection: "column", // Corrected from "col" to "column"

    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
  },
  boldText: {
    fontWeight: "bold",
  },
  qrCode: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  footer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 10,
    color: "#BE02D3",
  },
});

const PdfPrintTickitOnline = ({
  tickitData,
  logo,
}: {
  tickitData: any;
  logo: any;
}) => {
  const calculateReportingTime = (schedule: string | undefined): string => {
    if (!schedule || typeof schedule !== "string") {
      return "Invalid time";
    }
    const [time, period] = schedule.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let departureHours = period === "PM" && hours !== 12 ? hours + 12 : hours;
    if (period === "AM" && hours === 12) departureHours = 0;

    const departureTime = new Date();
    departureTime.setHours(departureHours, minutes, 0, 0);
    const reportingTime = new Date(departureTime.getTime() - 15 * 60 * 1000);
    const reportingHours = reportingTime.getHours() % 12 || 12;
    const reportingMinutes = reportingTime
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const reportingPeriod = reportingTime.getHours() >= 12 ? "PM" : "AM";

    return `${reportingHours}:${reportingMinutes} ${reportingPeriod}`;
  };

  const qrData = JSON.stringify({
    phone: tickitData?.data?.phone || "N/A",
    ticketNo: tickitData?.data?.ticketNo || "404NOTFOUND",
    seats: tickitData?.data?.orderSeat
      ?.map((seat: any) => seat?.seat)
      .join(", "),
    customerName: tickitData?.data?.customerName,
    address: tickitData?.data?.address,
    boardingPoint: tickitData?.data?.boardingPoint,
    droppingPoint: tickitData?.data?.droppingPoint,
    departureDate: tickitData?.data?.orderSeat?.[0]?.coachConfig?.departureDate,
    schedule: tickitData?.data?.orderSeat?.[0]?.coachConfig?.schedule,
  });

  const seatNo = tickitData?.data?.orderSeat?.filter(
    (s: any) => s.date === tickitData?.data?.date
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        <Image src={bus} style={styles.backgroundImage} />

        {/* Header */}
        <View style={styles.header}>
          <Image src={logo?.companyLogoBangla} style={styles.logo} />
          <Text style={styles.heading}>Online Ticket</Text>
          <Text style={styles.subHeading}>Hotline: 01945518927</Text>
        </View>

        {/* Content */}
        <View style={styles.section}>
          <View style={styles.col}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Ticket No:</Text>{" "}
              {tickitData?.data?.ticketNo}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Coach No:</Text>{" "}
              {seatNo?.[0]?.coachConfig?.coachNo}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Name:</Text>{" "}
              {tickitData?.data?.customerName}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Mobile:</Text>{" "}
              {tickitData?.data?.phone}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Boarding Point:</Text>{" "}
              {tickitData?.data?.boardingPoint}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Dropping Point:</Text>{" "}
              {tickitData?.data?.droppingPoint}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Journey Date:</Text>{" "}
              {seatNo?.[0]?.coachConfig?.departureDate
                ? new Date(
                    seatNo?.[0]?.coachConfig?.departureDate
                  ).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Issue Date:</Text>{" "}
              {tickitData?.data?.createdAt
                ? new Date(tickitData.data.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Reporting Time:</Text>{" "}
              {calculateReportingTime(seatNo?.[0]?.coachConfig?.schedule)}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Departure Time:</Text>{" "}
              {seatNo?.[0]?.coachConfig?.schedule}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Seat Fare (Tk):</Text>{" "}
              {seatNo?.[0]?.unitPrice}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Total Fare (Tk):</Text>{" "}
              {tickitData?.data?.paymentAmount}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>
            <Text style={styles.boldText}>Seat No:</Text>{" "}
            {seatNo?.map((seat: any) => seat?.seat).join(", ") || "N/A"}
          </Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrCode}>
          <QRCode value={qrData} size={80} />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Please keep your luggage under your own responsibility. Thank you.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfPrintTickitOnline;
