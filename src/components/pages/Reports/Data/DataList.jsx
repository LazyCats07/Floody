import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
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
import Box from '@mui/material/Box';
import PrintDataPDF from '../Data/PrintDataPDF'; // Import the PrintData component
import { RealTimeDataList } from './RealTimeDataList'; // Import your RealTimeDataList function
import loading from '../../../icon/loading-unscreen.gif'; 
import '../../../CSS/report.css';


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
  // const [statusPompaData, setStatusPompaData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);  // New state to check data loading status
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });

  useEffect(() => {
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
        // statusPompa: setStatusPompaData,
      };

      await RealTimeDataList(setters);
      setIsDataLoaded(true);  // Set data as loaded after fetching is complete
    }, 2000);

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => {
      clearInterval(intervalId);
      fetchData.cancel();
    };
  }, []); // Empty dependency array ensures this only runs once

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

  // Fungsi untuk memformat timestamp yang diterima
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Perlu ditambah 1 karena bulan dimulai dari 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Function to calculate the average value
  const calculateAverage = (data) => {
    let sum = 0;
    let count = 0;
    data.forEach((value) => {
      if (value != null && !isNaN(value)) {
        sum += value;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '0.00';
  };

  // Apply the filter to remove rows with all zeros
  const filterNonEmptyRows = (rows) => {
    return rows.filter(row => 
      row.curahHujanBS !== 0 ||
      row.curahHujanDK !== 0 ||
      row.debitCipalasari !== 0 ||
      row.debitCitarum !== 0 ||
      row.debitHilir !== 0 ||
      row.tmaSungai !== 0 ||
      row.tmaKolam !== 0 ||
      row.tmaHilir !== 0 
    );
  };

  // Mengelompokkan data berdasarkan 15 menit terakhir
  const aggregateDataFor15MinuteIntervals = () => {
    let groupedData = {};
    let currentTime = new Date();

    // Menyaring dan mengelompokkan data setiap 15 menit
    for (let i = 0; i < tmaSungaiData.length; i++) {
      let rowTime = new Date(formatTimestamp(tmaSungaiData[i]?.timestamp));

      // Round the timestamp to the nearest 15-minute interval
      rowTime = new Date(Math.floor(rowTime.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)); // Round down to nearest 15 minutes
      const formattedTime = formatTimestamp(rowTime);

      // Initialize group if not exists
      if (!groupedData[formattedTime]) {
        groupedData[formattedTime] = {
          curahHujanBS: [],
          curahHujanDK: [],
          debitCipalasari: [],
          debitCitarum: [],
          debitHilir: [],
          tmaSungai: [],
          tmaKolam: [],
          tmaHilir: [],
          // statusPompa: []
        };
      }

      // Add values to the corresponding group
      groupedData[formattedTime].curahHujanBS.push(curahHujanBSData[i]?.value);
      groupedData[formattedTime].curahHujanDK.push(curahHujanDKData[i]?.value);
      groupedData[formattedTime].debitCipalasari.push(debitCipalasariData[i]?.value);
      groupedData[formattedTime].debitCitarum.push(debitCitarumData[i]?.value);
      groupedData[formattedTime].debitHilir.push(debitHilirData[i]?.value);
      groupedData[formattedTime].tmaSungai.push(tmaSungaiData[i]?.value);
      groupedData[formattedTime].tmaKolam.push(tmaKolamData[i]?.value);
      groupedData[formattedTime].tmaHilir.push(tmaHilirData[i]?.value);
      // groupedData[formattedTime].statusPompa.push(statusPompaData[i]?.value);
    }

    // Calculate the average for each field
    const aggregatedData = [];
    Object.keys(groupedData).forEach((interval) => {
      const group = groupedData[interval];

      aggregatedData.push({
        timestamp: interval,
        curahHujanBS: calculateAverage(group.curahHujanBS),
        curahHujanDK: calculateAverage(group.curahHujanDK),
        debitCipalasari: calculateAverage(group.debitCipalasari),
        debitCitarum: calculateAverage(group.debitCitarum),
        debitHilir: calculateAverage(group.debitHilir),
        tmaSungai: calculateAverage(group.tmaSungai),
        tmaKolam: calculateAverage(group.tmaKolam),
        tmaHilir: calculateAverage(group.tmaHilir),
        //statusPompa: group.statusPompa[0] // Keep the first statusPompa as is (or can be adjusted as per logic)
      });
    });

    return aggregatedData;
  };

  const rows = filterNonEmptyRows(aggregateDataFor15MinuteIntervals()); // Filter rows

  // Ensure descending order by default
  rows.sort((a, b) => {
    const { key, direction } = sortConfig;
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);

    // Sorting in descending order
    if (dateA < dateB) return direction === "asc" ? -1 : 1;
    if (dateA > dateB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  if (!isDataLoaded) {
    return (
    // <p className='loading'>Loading...</p> 
    <div  className='con-loading'>
      <img src={loading} alt="loading" className='loading'/>
    </div>
  )}

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '25px' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontWeight: 'bold', fontFamily: 'Fira Sans', }}>
        Data Lingkungan Polder
      </Typography>
      <Divider />
      <Box height={10} />
      {/* Print Button */}
      <PrintDataPDF rows={rows}/>
      {/* <Box height={10} /> */}
      {/* <span style={{ fontSize: '12px', color: 'black', marginLeft: '10px'}}>
        *Data dalam 31 hari terakhir
      </span> */}
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table" id="printable-table">
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
                Debit Hulu Citarum (L/min) {sortConfig.key === "debitCitarum" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("debitHilir")}>
                Debit Hilir Citarum (L/min) {sortConfig.key === "debitHilir" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaKolam")}>
                TMA Kolam Polder (m) {sortConfig.key === "tmaKolam" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaSungai")}>
                TMA Sungai Citarum (m) {sortConfig.key === "tmaSungai" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaHilir")}>
                TMA Sungai Cipalasari (m) {sortConfig.key === "tmaHilir" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              {/* <TableCell align="left" onClick={() => handleSort("statusPompa")}>
                Status Pompa {sortConfig.key === "statusPompa" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell> */}
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
                {/* <TableCell align="left">{row.statusPompa}</TableCell> */}
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
