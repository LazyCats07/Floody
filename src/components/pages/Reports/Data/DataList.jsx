import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash'; // Import lodash untuk debounce
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import autoTable plugin
import { RealTimeDataList } from './RealTimeDataList'; // Import the RealTimeDataList function

export default function DataList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [curahHujanBSData, setCurahHujanBSData] = useState([]);
  const [curahHujanDKData, setCurahHujanDKData] = useState([]);
  const [debitCipalasariData, setDebitCipalasariData] = useState([]);
  const [debitCitarumData, setDebitCitarumData] = useState([]);
  const [debitHilirData, setDebitHilirData] = useState([]);
  const [tmaSungaiData, setTmaSungaiData] = useState([]);
  const [tmaKolamData, setTmaKolamData] = useState([]);
  const [tmaHilirData, setTmaHilirData] = useState([]);
  const [statusPompaData, setStatusPompaData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });

  useEffect(() => {
    // Debounced fetch function to optimize Firebase calls
    const fetchData = debounce(async () => {
      const setters = {
        curahHujanBS: setCurahHujanBSData,
        curahHujanDK: setCurahHujanDKData,
        debitCipalasari: setDebitCipalasariData,
        debitCitarum: setDebitCitarumData,
        debitHilir: setDebitHilirData,
        tmaSungai: setTmaSungaiData,
        tmaKolam: setTmaKolamData,
        tmaHilir: setTmaHilirData,
        statusPompa: setStatusPompaData,
      };

      // Firebase query to fetch data based on a limit or filter
      RealTimeDataList(setters);
    }, 3000); // 1-second delay for debouncing the function

    fetchData();

    return () => {
      fetchData.cancel(); // Clean up debouncing when the component unmounts
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSort = (column) => {
    let newDirection = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      newDirection = "desc";
    }
    setSortConfig({ key: column, direction: newDirection });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Format the timestamp to ensure it's sorted correctly
  const formatTimestamp = (timestamp) => {
    const formattedTimestamp = timestamp.replace(/_/g, ':').replace(/-/g, '/');
    const date = new Date(formattedTimestamp);
    return date;
  };

  // Combine all data into rows for the table display
  const rows = [];
  for (let i = 0; i < curahHujanBSData.length; i++) {
    rows.push({
      timestamp: tmaKolamData[i]?.timestamp || '-',
      curahHujanBS: curahHujanBSData[i]?.value || '-',
      curahHujanDK: curahHujanDKData[i]?.value || '-',
      debitCipalasari: debitCipalasariData[i]?.value || '-',
      debitCitarum: debitCitarumData[i]?.value || '-',
      debitHilir: debitHilirData[i]?.value || '-',
      tmaSungai: tmaSungaiData[i]?.value || '-',
      tmaKolam: tmaKolamData[i]?.value || '-',
      tmaHilir: tmaHilirData[i]?.value || '-',
      statusPompa: statusPompaData[i]?.value || '-',
    });
  }

  // Sort the rows based on the timestamp
  rows.sort((a, b) => {
    const { key, direction } = sortConfig;
    const dateA = formatTimestamp(a[key]);
    const dateB = formatTimestamp(b[key]);

    if (dateA < dateB) return direction === "asc" ? -1 : 1;
    if (dateA > dateB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Function to generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Laporan Tinggi Air Polder', 20, 20);
    doc.setFontSize(12);
    doc.text('Data lingkungan polder terekam:', 20, 30);

    // Prepare the table data
    const tableData = rows.map((row) => [
      row.timestamp,
      row.curahHujanBS,
      row.curahHujanDK,
      row.debitCipalasari,
      row.debitCitarum,
      row.debitHilir,
      row.tmaKolam,
      row.tmaSungai,
      row.tmaHilir,
      row.statusPompa,
    ]);

    // Using autoTable plugin to add the table to the PDF
    doc.autoTable({
      startY: 40,
      head: [['Waktu', 'Curah Hujan (mm)', 'Debit Cipalasari (L/min)', 'Debit Citarum (L/min)', 'Debit Hilir (L/min)', 'TMA Kolam Polder (m)', 'TMA Sungai Citarum (m)', 'TMA Hilir (m)', 'Status Pompa']],
      body: tableData,
    });

    // Save the generated PDF
    doc.save('laporan_tinggi_air_polder.pdf');
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
        Data Lingkungan Polder
      </Typography>
      <Divider />

      {/* Button to generate PDF report */}
      <Button variant="contained" color="primary" onClick={generatePDF} sx={{ margin: "10px" }}>
        Generate Laporan PDF
      </Button>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" onClick={() => handleSort("timestamp")}>
                Waktu {sortConfig.key === "timestamp" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("curahHujanBS")}>
                Curah Hujan Bandung Bojongsoang (mm) {sortConfig.key === "curahHujanBS" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("curahHujanDK")}>
                Curah Hujan Bandung Dayeuhkolot (mm) {sortConfig.key === "curahHujanDK" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("debitCipalasari")}>
                Debit Cipalasari (L/min) {sortConfig.key === "debitCipalasari" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("debitCitarum")}>
                Debit Citarum (L/min) {sortConfig.key === "debitCitarum" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("debitHilir")}>
                Debit Hilir (L/min) {sortConfig.key === "debitHilir" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaKolam")}>
                TMA Kolam Polder (m) {sortConfig.key === "tmaKolam" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaSungai")}>
                TMA Sungai Citarum (m) {sortConfig.key === "tmaSungai" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaHilir")}>
                TMA Hilir (m) {sortConfig.key === "tmaHilir" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("statusPompa")}>
                Status Pompa {sortConfig.key === "statusPompa" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell align="left">{row.timestamp}</TableCell>
                <TableCell align="left">{row.curahHujanBS}</TableCell>
                <TableCell align="left">{row.curahHujanDK}</TableCell>
                <TableCell align="left">{row.debitCipalasari}</TableCell>
                <TableCell align="left">{row.debitCitarum}</TableCell>
                <TableCell align="left">{row.debitHilir}</TableCell>
                <TableCell align="left">{row.tmaKolam}</TableCell>
                <TableCell align="left">{row.tmaSungai}</TableCell>
                <TableCell align="left">{row.tmaHilir}</TableCell>
                <TableCell align="left">{row.statusPompa}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
