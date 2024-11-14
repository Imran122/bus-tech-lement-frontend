import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dynamicSeatAllocationForReport } from "@/utils/helpers/dynamicAllocationForReport";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "semibold",
  },
  subHeading: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: "bold",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 7,
    textAlign: "center",
    paddingVertical: 2,
  },
  logo: {
    width: 30,
    height: 30,
    marginBottom: 10,
    alignSelf: "center",
  },
  margin: {
    marginTop: 10,
  },
});

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

const PdfTripSheet = ({ bookingCoach, selectedTables }: any) => {
    const { appName, logo } = appConfiguration;
    const currentDate = format(new Date(), "MMMM dd, yyyy");
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
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Section for Logo, Title, and Date */}
          <View style={styles.section}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.heading}>{appName}</Text>
            <Text style={styles.subHeading}>Date: {currentDate}</Text>
            <Text style={styles.title}>Trip Sheet Report</Text>
          </View>
  
          {/* Section for Trip Sheet */}
          {selectedTables.tripSheet && (
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  {["Registration No", "Driver", "Guide", "Helper"].map((header, index) => (
                    <View style={styles.tableHeader} key={index}>
                      <Text>{header}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}><Text>{registrationNo}</Text></View>
                  <View style={styles.tableCol}><Text>{driver}</Text></View>
                  <View style={styles.tableCol}><Text>{driver}</Text></View>
                  <View style={styles.tableCol}><Text>{helper}</Text></View>
                </View>
              </View>
            </View>
          )}
  
          {/* Section for Coach Details */}
          {selectedTables.coachDetails && (
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  {["Coach No", "Coach Type", "Route Name", "Starting Point", "Ending Point", "Total Sold", "Total Available", "Journey Date Time"].map((header, index) => (
                    <View style={styles.tableHeader} key={index}>
                      <Text>{header}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol}><Text>{coachNo}</Text></View>
                  <View style={styles.tableCol}><Text>{coachType}</Text></View>
                  <View style={styles.tableCol}><Text>{route?.routeName}</Text></View>
                  <View style={styles.tableCol}><Text>{fromCounter?.address}</Text></View>
                  <View style={styles.tableCol}><Text>{destinationCounter?.address}</Text></View>
                  <View style={styles.tableCol}><Text>{orderSeat?.length}</Text></View>
                  <View style={styles.tableCol}><Text>{seatAvailable}</Text></View>
                  <View style={styles.tableCol}><Text>{departureDate}, {schedule}</Text></View>
                </View>
              </View>
            </View>
          )}
  
          {/* Section for Passenger Information */}
          {selectedTables.passengerInfo && (
            <View style={styles.section}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  {["Seat", "Passenger Name", "Mobile", "Ticket No", "Fare", "From Station", "To Station", "Issue Counter", "Ordered By", "Remarks"].map((header, index) => (
                    <View style={styles.tableHeader} key={index}>
                      <Text>{header}</Text>
                    </View>
                  ))}
                </View>
                {seatsAllocation.map((data, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableCol}><Text>{data.seat}</Text></View>
                    <View style={styles.tableCol}><Text>{data.passengerName}</Text></View>
                    <View style={styles.tableCol}><Text>{data.mobile}</Text></View>
                    <View style={styles.tableCol}><Text>{data.ticketNo}</Text></View>
                    <View style={styles.tableCol}><Text>{data.fare}</Text></View>
                    <View style={styles.tableCol}><Text>{data.fromStation}</Text></View>
                    <View style={styles.tableCol}><Text>{data.toStation}</Text></View>
                    <View style={styles.tableCol}><Text>{data.issueCounterName || "Online"}</Text></View>
                    <View style={styles.tableCol}><Text>{data.orderBy || "Online"}</Text></View>
                    <View style={styles.tableCol}><Text>{data.remarks}</Text></View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Page>
      </Document>
    );
  };
  
  export default PdfTripSheet;
  
