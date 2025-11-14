import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';



const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 5,
  },
  table: {
    width: '100%',
    border: '1px solid #000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRight: '1px solid #000',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderRight: '1px solid #000',
  },
  rightAlign: {
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 8,
  },
});

interface InvoicePDFProps {
  tenCuaHang: string;
  diaChi: string;
  idHoaDon: number;
  ngayLap: string;
  chiTiet: {
    ten_san_pham: string;
    so_luong: number;
    don_gia: number;
    thanh_tien: number;
  }[];
  tongTien: number;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({
  tenCuaHang,
  diaChi,
  idHoaDon,
  ngayLap,
  chiTiet,
  tongTien,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{tenCuaHang}</Text>
        <Text style={styles.subtitle}>{diaChi}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { textAlign: 'center', marginBottom: 10 }]}>
        HOA DON  #{idHoaDon}
      </Text>

      {/* Info */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text>Ngày: {ngayLap}</Text>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellHeader, { flex: 3 }]}>Tên</Text>
          <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>SL</Text>
          <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Don Gia</Text>
          <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Tong</Text>
        </View>
        {chiTiet.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>
              {item.ten_san_pham}
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>
              {item.so_luong}
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
              {item.don_gia.toLocaleString()}
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
              {item.thanh_tien.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
        <Text style={[styles.bold, { marginRight: 10 }]}>Tong tien:</Text>
        <Text style={styles.bold}>{tongTien.toLocaleString()} VNĐ</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Cam on quy khach!</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;