import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
  },
  section: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    padding: 2,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    height: 25, // Uniform header height
    whiteSpace: "nowrap", // Prevent text wrapping
  },
  tableCell: {
    flex: 1,
    padding: 2,
    fontSize: 8,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    whiteSpace: "nowrap", // Prevent text wrapping
  },
  summaryTable: {
    width: "50%",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  bothTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "stretch",
  },
  halfTable: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "stretch",
  },
  logo: {
    width: 60,
    height: 40,
    marginBottom: 10,
  },
});

const TripWiseReportPDF = ({
  reportData,
  dateRange,
  logo,
  selectedTripNo,
}: any) => {
  const {
    upWayCoachInfo = [],
    downWayCoachInfo = [],
    collectionReport = [],
    expenseReport = [],
    totalIncome = 0,
    totalExpense = 0,
    totalAmount = 0,
    gp = 0,
  } = reportData?.data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Image source={logo?.companyLogoBangla} style={styles.logo} />
          <Text style={styles.heading}>Iconic Express</Text>
          <Text style={styles.subHeading}>Trip No: {selectedTripNo}</Text>
          <Text style={styles.subHeading}>Date Range: {dateRange}</Text>
          <Text style={styles.title}>Trip-Wise Report</Text>
        </View>

        {/* Main Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {[
              "Coach",
              "Coach No",
              "Route Name",
              "Registration No",
              "Supervisor Name",
              "Driver Name",
              "Helper Name",
            ].map((header, index) => (
              <Text key={index} style={styles.tableHeader}>
                {header}
              </Text>
            ))}
          </View>
          {[upWayCoachInfo, downWayCoachInfo].map((info, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>
                {index === 0 ? "Up Way Coach" : "Down Way Coach"}
              </Text>
              <Text style={styles.tableCell}>{info?.coachNo || "N/A"}</Text>
              <Text style={styles.tableCell}>
                {info?.route?.routeName || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {info?.registrationNo || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {info?.supervisor?.userName || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {info?.driver?.name || "N/A"}
              </Text>
              <Text style={styles.tableCell}>
                {info?.helper?.name || "N/A"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.bothTable}>
          {/* Income Table */}
          <View style={styles.halfTable}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 5 }]}>
                Receive / Income
              </Text>
            </View>
            <View style={styles.tableRow}>
              {[
                "Counter Name",
                "Counter Master Name",
                "Qty",
                "Fare",
                "Total Price",
              ].map((header, index) => (
                <Text key={index} style={styles.tableHeader}>
                  {header}
                </Text>
              ))}
            </View>
            {collectionReport.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{row.counterName || "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {row.counterMasterName || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{row.noOfPassenger || 0}</Text>
                <Text style={styles.tableCell}>{row.fare || 0}</Text>
                <Text style={styles.tableCell}>{row.amount || 0}</Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 4 }]}>
                Total Income
              </Text>
              <Text style={styles.tableHeader}>{totalIncome}</Text>
            </View>
          </View>

          {/* Expense Table */}
          <View style={styles.halfTable}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Expense</Text>
              <Text style={[styles.tableHeader, { flex: 1 }]}>
                Total Amount
              </Text>
            </View>
            <View style={styles.tableRow}>
              {["Expense Name", "Amount", "Total Amount"].map(
                (header, index) => (
                  <Text key={index} style={styles.tableHeader}>
                    {header}
                  </Text>
                )
              )}
            </View>
            {expenseReport.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>
                  {row.expenseCategory || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{row.amount || 0}</Text>
                <Text style={styles.tableCell}>{row.amount || 0}</Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Total Expense</Text>
              <Text style={styles.tableHeader}>{totalExpense}</Text>
              <Text style={styles.tableHeader}>{totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Summary</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Balance</Text>
            <Text style={styles.tableCell}>{totalIncome - totalExpense}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>GP</Text>
            <Text style={styles.tableCell}>{gp}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Gross Income</Text>
            <Text style={styles.tableCell}>
              {totalIncome - totalExpense - gp}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TripWiseReportPDF;
