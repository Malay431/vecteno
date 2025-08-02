import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font
} from "@react-pdf/renderer";

// Optional: custom fonts
// Font.register({ family: 'Roboto', src: '/fonts/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    marginBottom: 14,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tableHeader: {
    borderBottom: "1 solid #999",
    paddingBottom: 6,
    marginBottom: 6,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  total: {
    marginTop: 12,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    fontSize: 10,
    textAlign: "center",
    color: "#888",
  },
});

export default function InvoicePDF({ transaction }) {
  const date = new Date(transaction.createdAt).toDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Company Info */}
        <View style={styles.header}>
          <Text style={styles.title}>VECTENO</Text>
          <Text style={styles.subtitle}>www.vecteno.com</Text>
          <Text style={styles.subtitle}>support@vecteno.com</Text>
        </View>

        {/* Invoice Meta */}
        <View style={styles.section}>
          <Text>Invoice #: {transaction.id}</Text>
          <Text>Date: {date}</Text>
        </View>

        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.bold}>Billed To:</Text>
          <Text>{transaction.user.name}</Text>
          <Text>{transaction.user.email}</Text>
        </View>

        {/* Purchase Details */}
        <View style={styles.section}>
          <Text style={styles.tableHeader}>Purchase Summary</Text>
          <View style={styles.tableRow}>
            <Text>Premium Subscription</Text>
            <Text>₹{transaction.amount}/-</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text>Total Paid: ₹{transaction.amount}/-</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your purchase!</Text>
          <Text>This is a system-generated invoice.</Text>
        </View>
      </Page>
    </Document>
  );
}
