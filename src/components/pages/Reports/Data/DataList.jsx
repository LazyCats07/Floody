import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { RealTimeDataList } from './RealTimeDataList'; // Import the RealTimeDataList function

export default function DataList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // State to store real-time data for each category
  const [curahHujanData, setCurahHujanData] = useState([]);
  const [debitCipalasariData, setDebitCipalasariData] = useState([]);
  const [debitCitarumData, setDebitCitarumData] = useState([]);
  const [debitHilirData, setDebitHilirData] = useState([]);
  const [tmaSungaiData, setTmaSungaiData] = useState([]);
  const [tmaKolamData, setTmaKolamData] = useState([]);
  const [tmaHilirData, setTmaHilirData] = useState([]);
  const [statusPompaData, setStatusPompaData] = useState([]);

  // State for sorting (default to descending)
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });

  // UseEffect to fetch and update the real-time data from Firebase
  useEffect(() => {
    const setters = {
      curahHujan: setCurahHujanData,
      debitCipalasari: setDebitCipalasariData,
      debitCitarum: setDebitCitarumData,
      debitHilir: setDebitHilirData,
      tmaSungai: setTmaSungaiData,
      tmaKolam: setTmaKolamData,
      tmaHilir: setTmaHilirData,
      statusPompa: setStatusPompaData,
    };

    // Call RealTimeDataList to fetch data and pass setters for state updating
    RealTimeDataList(setters);
  }, []); // Empty dependency array means this effect runs only once when the component mounts

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

  // Combine all data into rows for the table display
  const rows = [];
  for (let i = 0; i < curahHujanData.length; i++) {
    rows.push({
      timestamp: curahHujanData[i].timestamp,
      curahHujan: curahHujanData[i].value,
      debitCipalasari: debitCipalasariData[i] ? debitCipalasariData[i].value : '-',
      debitCitarum: debitCitarumData[i] ? debitCitarumData[i].value : '-',
      debitHilir: debitHilirData[i] ? debitHilirData[i].value : '-',
      tmaSungai: tmaSungaiData[i] ? tmaSungaiData[i].value : '-',
      tmaKolam: tmaKolamData[i] ? tmaKolamData[i].value : '-',
      tmaHilir: tmaHilirData[i] ? tmaHilirData[i].value : '-',
      statusPompa: statusPompaData[i] ? statusPompaData[i].value : '-', // Include Status Pompa here
    });
  }

  // Sort the rows based on the sortConfig
  rows.sort((a, b) => {
    const { key, direction } = sortConfig;
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
        Data Lingkungan Polder
      </Typography>
      <Divider />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" onClick={() => handleSort("timestamp")}>
                Waktu {sortConfig.key === "timestamp" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("curahHujan")}>
                Curah Hujan Bandung (mm) {sortConfig.key === "curahHujan" && (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                <TableCell align="left">{row.curahHujan}</TableCell>
                <TableCell align="left">{row.debitCipalasari}</TableCell>
                <TableCell align="left">{row.debitCitarum}</TableCell>
                <TableCell align="left">{row.debitHilir}</TableCell>
                <TableCell align="left">{row.tmaKolam}</TableCell>
                <TableCell align="left">{row.tmaSungai}</TableCell>
                <TableCell align="left">{row.tmaHilir}</TableCell>
                <TableCell align="left">{row.statusPompa}</TableCell> {/* Include Status Pompa in the row */}
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
