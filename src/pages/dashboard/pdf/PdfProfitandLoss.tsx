import { appConfiguration } from "@/utils/constants/common/appConfiguration";
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
    borderColor: "#ccc",
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
    borderColor: "#ccc",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 2,
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 7,
    textAlign: "center",
    paddingVertical: 2,
  },
  logo: {
    width: 40,
    height: 25,
    marginBottom: 10,
    alignSelf: "center",
  },
});

const PdfProfitAndLoss = ({ profitData, logo, dateRange }: any) => {
  const { appName } = appConfiguration;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Logo and Title */}
          <Image source={logo?.companyLogoBangla} style={styles.logo} />
          <Text style={styles.heading}>{appName}</Text>
          <Text style={styles.subHeading}>Date Range: {dateRange}</Text>
          <Text style={styles.title}>Profit and Loss Report</Text>

          {/* Table Header */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {[
                "Date",
                "Trip No",
                "Bus No",
                "Up Date",
                "Down Date",
                "Passenger Up",
                "Passenger Down",
                "Passenger Total",
                "Up Income",
                "Down Income",
                "Up-Down Total Amount",
                "Road Expenses",
                "Total Balance",
                "Iconic Express GP",
                "Trip Wise Profit",
              ].map((header, index) => (
                <Text key={index} style={styles.tableHeader}>
                  {header}
                </Text>
              ))}
            </View>

            {/* Table Rows */}
            {profitData?.map((row: any, index: any) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCol}>{row.date ?? "N/A"}</Text>
                <Text style={styles.tableCol}>{row.id ?? "N/A"}</Text>
                <Text style={styles.tableCol}>
                  {row.registrationNo ?? "N/A"}
                </Text>
                <Text style={styles.tableCol}>{row.upDate ?? "N/A"}</Text>
                <Text style={styles.tableCol}>{row.downDate ?? "N/A"}</Text>
                <Text style={styles.tableCol}>
                  {row.passengerUpWay ?? "N/A"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.passengerDownWay ?? "N/A"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.totalPassenger ?? "N/A"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.upWayIncome?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.downWayIncome?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {(row.upWayIncome + row.downWayIncome)?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.totalExpense?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.cashOnHand?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {row.gp?.toFixed(2) ?? "0.00"}
                </Text>
                <Text style={styles.tableCol}>
                  {(row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00"}
                </Text>
              </View>
            ))}

            {/* Footer Totals */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Totals</Text>
              {[...Array(9)].map((_, i) => (
                <Text key={i} style={styles.tableCol}>
                  {"\u00A0"}
                </Text>
              ))}
              <Text style={styles.tableCol}>
                {profitData
                  ?.reduce(
                    (acc: any, row: any) =>
                      acc + (row.upWayIncome + row.downWayIncome || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData
                  ?.reduce(
                    (acc: any, row: any) => acc + (row.totalExpense || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData
                  ?.reduce(
                    (acc: any, row: any) => acc + (row.cashOnHand || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData
                  ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                  .toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData
                  ?.reduce(
                    (acc: any, row: any) =>
                      acc + (row.cashOnHand - row.gp || 0),
                    0
                  )
                  .toFixed(2) ?? "0.00"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PdfProfitAndLoss;
