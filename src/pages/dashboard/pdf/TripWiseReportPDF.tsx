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
  headerSection: {
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 40,
    marginBottom: 5,
  },
  heading: {
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    marginVertical: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    flex: 1,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 1, // Reduced padding
    paddingHorizontal: 2, // Reduced padding
    whiteSpace: "nowrap",
    overflow: "hidden",
    wordWrap: "nowrap",
    textOverflow: "ellipsis", // Ensures all text fits in one line
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 2,
  },
  headerRoute: {
    paddingHorizontal: 10, // Horizontal padding for "Route Name"
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
  },
  tableCellroute: {
    flex: 1,
    fontSize: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    flexWrap: "wrap",
    wordWrap: "break-word",
  },
  lastCell: {
    borderRightWidth: 0, // Remove right border for the last cell
  },
  bothTable: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
    alignItems: "stretch",
  },
  incomeTable: {
    flex: 3, // Occupies more space than expense table
    borderWidth: 1,
    borderColor: "#ccc",
  },
  expenseTable: {
    flex: 2, // Occupies less space
    borderWidth: 1,
    borderColor: "#ccc",
  },
  summaryTable: {
    width: "50%",
    alignSelf: "flex-end",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image source={logo?.companyLogoBangla} style={styles.logo} />
          <Text style={styles.heading}>Iconic Express</Text>
          <Text style={styles.title}>Trip-Wise Report</Text>
        </View>
        <View style={styles.headerSection}>
          <Text style={styles.subHeading}>Trip No: {selectedTripNo}</Text>
          <Text style={styles.subHeading}>Date: {dateRange}</Text>
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
              <Text
                key={index}
                style={[
                  index === 2 ? styles.headerRoute : styles.tableHeader,
                  index === 6 ? styles.lastCell : {},
                ]}
              >
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
              <Text style={styles.tableCellroute}>
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
              <Text style={[styles.tableCell, styles.lastCell]}>
                {info?.helper?.name || "N/A"}
              </Text>
            </View>
          ))}
        </View>

        {/* Income and Expense Tables */}
        <View style={styles.bothTable}>
          {/* Income Table */}
          <View style={styles.incomeTable}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 6 }]}>
                Receive / Income
              </Text>
            </View>
            <View style={styles.tableRow}>
              {[
                "Counter Name",
                "Counter Master Name",
                "Qty",
                "Fare",
                "Discount",
                "Total Price",
              ].map((header, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tableHeader,
                    index === 5 ? styles.lastCell : {},
                  ]}
                >
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
                <Text style={styles.tableCell}>00.00</Text>
                <Text style={[styles.tableCell, styles.lastCell]}>
                  {row.amount || 0}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 5 }]}>
                Total Income
              </Text>
              <Text style={[styles.tableHeader, styles.lastCell]}>
                {totalIncome}
              </Text>
            </View>
          </View>

          {/* Expense Table */}
          <View style={styles.expenseTable}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHeader, { flex: 6 }]}>
                Expense & Total Amount
              </Text>
            </View>
            <View style={styles.tableRow}>
              {["Expense Name", "Amount", "Total Amount"].map(
                (header, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.tableHeader,
                      index === 2 ? styles.lastCell : {},
                    ]}
                  >
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
                <Text style={[styles.tableCell, styles.lastCell]}>
                  {row.amount || 0}
                </Text>
              </View>
            ))}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Total Expense</Text>
              <Text style={styles.tableHeader}>{totalExpense}</Text>
              <Text style={[styles.tableHeader, styles.lastCell]}>
                {totalAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Table */}
        <View style={styles.summaryTable}>
          {[
            { label: "Balance", value: totalIncome - totalExpense },
            { label: "GP", value: gp },
            { label: "Gross Income", value: totalIncome - totalExpense - gp },
          ].map((row, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{row.label}</Text>
              <Text style={[styles.tableCell, styles.lastCell]}>
                {row.value.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TripWiseReportPDF;
