import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
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
            <Image source={logo?.companyLogoBangla} style={styles.logo} />
            <Text style={styles.heading}>{appName}</Text>
            <Text style={styles.subHeading}>Date Range: {dateRange}</Text>
            <Text style={styles.title}>Profit and Loss Report</Text>
  
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                {[
                  "Trip No",
                  "Down Date",
                  "Bus No",
                  "Up-Down Total Amount",
                  "Iconic Transport Road Expenses",
                  "Iconic Transport Balance",
                  "Iconic Express GP",
                  "Trip Wise Profit"
                ].map((header, index) => (
                  <Text key={index} style={styles.tableHeader}>
                    {header}
                  </Text>
                ))}
              </View>
  
              {/* Table Rows */}
              {profitData?.data?.map((row: any, index: number) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCol}>{row.id}</Text>
                  <Text style={styles.tableCol}>{row.downDate ?? "N/A"}</Text>
                  <Text style={styles.tableCol}>{row.registrationNo ?? "N/A"}</Text>
                  <Text style={styles.tableCol}>
                    {(row.totalIncome - row.totalExpense)?.toFixed(2) ?? "0.00"}
                  </Text>
                  <Text style={styles.tableCol}>
                    {row.totalExpense?.toFixed(2) ?? "0.00"}
                  </Text>
                  <Text style={styles.tableCol}>
                    {row.cashOnHand?.toFixed(2) ?? "0.00"}
                  </Text>
                  <Text style={styles.tableCol}>{row.gp?.toFixed(2) ?? "0.00"}</Text>
                  <Text style={styles.tableCol}>
                    {(row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00"}
                  </Text>
                </View>
              ))}
            </View>
  
            {/* Footer Row (Totals) */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Totals</Text>
              <Text style={styles.tableCol}>
                {profitData?.data?.reduce(
                  (acc: any, row: any) => acc + (row.totalIncome - row.totalExpense || 0),
                  0
                ).toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData?.data?.reduce(
                  (acc: any, row: any) => acc + (row.totalExpense || 0),
                  0
                ).toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData?.data?.reduce(
                  (acc: any, row: any) => acc + (row.cashOnHand || 0),
                  0
                ).toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData?.data?.reduce(
                  (acc: any, row: any) => acc + (row.gp || 0),
                  0
                ).toFixed(2) ?? "0.00"}
              </Text>
              <Text style={styles.tableCol}>
                {profitData?.data?.reduce(
                  (acc: any, row: any) => acc + (row.cashOnHand - row.gp || 0),
                  0
                ).toFixed(2) ?? "0.00"}
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };
  

export default PdfProfitAndLoss;
