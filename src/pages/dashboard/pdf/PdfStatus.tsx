
import { format } from "date-fns";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";

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
});

const PdfStatusReport = ({ result }: any) => {
  const { appName, logo } = appConfiguration;
  const currentDate = format(new Date(), "MMMM dd, yyyy");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>
            Date: {currentDate}
          </Text>
          <Text style={styles.title}>Counter Booking Status Report</Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableHeader}><Text>Counter Name</Text></View>
              <View style={styles.tableHeader}><Text>Ordered By</Text></View>
              <View style={styles.tableHeader}><Text>Phone</Text></View>
              <View style={styles.tableHeader}><Text>Booked Count</Text></View>
              <View style={styles.tableHeader}><Text>Booked Seat No.</Text></View>
              <View style={styles.tableHeader}><Text>Sold Count</Text></View>
              <View style={styles.tableHeader}><Text>Sold Seat No.</Text></View>
            </View>

            {result?.map((status: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text>{status.counterName || "N/A"}</Text></View>
                <View style={styles.tableCol}><Text>{status.orderBy || "N/A"}</Text></View>
                <View style={styles.tableCol}><Text>{status.phone || "N/A"}</Text></View>
                <View style={styles.tableCol}><Text>{status.bookedCount || 0}</Text></View>
                <View style={styles.tableCol}><Text>{status.bookedSeat.join(", ") || "N/A"}</Text></View>
                <View style={styles.tableCol}><Text>{status.soldCount || 0}</Text></View>
                <View style={styles.tableCol}><Text>{status.soldSeat.join(", ") || "N/A"}</Text></View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfStatusReport;
