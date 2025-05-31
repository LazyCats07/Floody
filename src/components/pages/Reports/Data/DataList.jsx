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
import PrintDataPDF from '../Data/PrintDataPDF';
import { RealTimeDataList } from './RealTimeDataList';
import loading from '../../../icon/loading-unscreen.gif'; 
import '../../../CSS/report.css';

export default function DataList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [curahHujanBSData, setCurahHujanBSData] = useState([]);
  const [curahHujanDKData, setCurahHujanDKData] = useState([]);
  const [debitCipalasariData, setDebitCipalasariData] = useState([]);
  const [debitHuluData, setDebitHuluData] = useState([]);
  const [debitHilirData, setDebitHilirData] = useState([]);
  const [tmaCipalasariData, setTmaCipalasariData] = useState([]);
  const [tmaKolamData, setTmaKolamData] = useState([]);
  const [tmaCitarumData, setTmaCitarumData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "timestamp", direction: "desc" });

  useEffect(() => {
    const fetchData = debounce(async () => {
      const setters = {
        curahHujanBS: setCurahHujanBSData,
        curahHujanDK: setCurahHujanDKData,
        debitCipalasari: setDebitCipalasariData,
        debitHulu: setDebitHuluData,
        debitHilir: setDebitHilirData,
        tmaCipalasari: setTmaCipalasariData,
        tmaKolam: setTmaKolamData,
        tmaCitarum: setTmaCitarumData,
      };

      await RealTimeDataList(setters);
      setIsDataLoaded(true);
    }, 2000);

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 15 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
      fetchData.cancel();
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

  // Format timestamp untuk tampil di tabel
  // const formatTimestamp = (timestamp) => {
  //   const date = new Date(timestamp);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   const hours = String(date.getHours()).padStart(2, '0');
  //   const minutes = String(date.getMinutes()).padStart(2, '0');
  //   const seconds = String(date.getSeconds()).padStart(2, '0');
  //   return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  // };

  const formatIntervalKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const calculateAverage = (data) => {
  let sum = 0;
  let count = 0;
  data.forEach((value) => {
    if (value !== null && value !== "null" && !isNaN(value)) {
      sum += Number(value);
      count++;
    }
  });
  return count > 0 ? (sum / count).toFixed(2) : "null";
};

const aggregateDataFor15MinuteIntervals = () => {
  if (!curahHujanBSData.length || !curahHujanDKData.length || !tmaCipalasariData.length) {
    return [];
  }

  // Rounding ke bawah ke interval 15 menit
  const roundTo15Minfloor = (date) =>
    new Date(Math.floor(date.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));

  const groupedData = new Map();

  const addToGroup = (intervalKey, key, value) => {
    if (!groupedData.has(intervalKey)) {
      groupedData.set(intervalKey, {
        curahHujanBS: "null",
        curahHujanDK: "null",
        debitCipalasari: [],
        debitHulu: [],
        debitHilir: [],
        tmaCipalasari: [],
        tmaKolam: [],
        tmaCitarum: [],
      });
    }
    const group = groupedData.get(intervalKey);
    if (Array.isArray(group[key])) {
      group[key].push(value != null ? value : "null");
    } else {
      group[key] = value != null ? value : "null";
    }
  };

  // Map curah hujan per jam
  const curahHujanBSPerJam = {};
  const curahHujanDKPerJam = {};

  curahHujanBSData.forEach(item => {
    if (!item) return;
    const date = new Date(item.timestamp);
    if (isNaN(date)) return;
    const hourKey = date.toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 13);
    curahHujanBSPerJam[hourKey] = item.value ?? "null";
  });

  curahHujanDKData.forEach(item => {
    if (!item) return;
    const date = new Date(item.timestamp);
    if (isNaN(date)) return;
    const hourKey = date.toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 13);
    curahHujanDKPerJam[hourKey] = item.value ?? "null";
  });

  const processDataArray = (dataArray, keyName) => {
    dataArray.forEach(item => {
      if (!item) return;
      const date = new Date(item.timestamp);
      if (isNaN(date)) return;
      const intervalDate = roundTo15Minfloor(date);
      const intervalKey = formatIntervalKey(intervalDate);

      addToGroup(intervalKey, keyName, item.value);
    });
  };

  processDataArray(debitCipalasariData, "debitCipalasari");
  processDataArray(debitHuluData, "debitHulu");
  processDataArray(debitHilirData, "debitHilir");
  processDataArray(tmaCipalasariData, "tmaCipalasari");
  processDataArray(tmaKolamData, "tmaKolam");
  processDataArray(tmaCitarumData, "tmaCitarum");

  // Isi curah hujan per jam ke setiap interval
  groupedData.forEach((group, intervalKey) => {
    const hourKey = intervalKey.slice(0, 13);
    group.curahHujanBS = curahHujanBSPerJam[hourKey] ?? "null";
    group.curahHujanDK = curahHujanDKPerJam[hourKey] ?? "null";

    // DEBUG: cek apakah ada interval dengan nilai null di tmaCitarum
    if (group.tmaCitarum.every(v => v === "null")) {
      console.warn(`Interval ${intervalKey} hanya ada nilai null di tmaCitarum`);
    }
  });

  const aggregatedData = [];
  groupedData.forEach((group, intervalKey) => {
    aggregatedData.push({
      timestamp: intervalKey,
      curahHujanBS: group.curahHujanBS !== "null" ? Number(group.curahHujanBS).toFixed(2) : "null",
      curahHujanDK: group.curahHujanDK !== "null" ? Number(group.curahHujanDK).toFixed(2) : "null",
      debitCipalasari: calculateAverage(group.debitCipalasari),
      debitHulu: calculateAverage(group.debitHulu),
      debitHilir: calculateAverage(group.debitHilir),
      tmaCipalasari: calculateAverage(group.tmaCipalasari),
      tmaKolam: calculateAverage(group.tmaKolam),
      tmaCitarum: calculateAverage(group.tmaCitarum),
    });
  });

  return aggregatedData;
};



  const rows = aggregateDataFor15MinuteIntervals();

  rows.sort((a, b) => {
    const { key, direction } = sortConfig;
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    if (dateA < dateB) return direction === "asc" ? -1 : 1;
    if (dateA > dateB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  if (!isDataLoaded) {
    return (
      <div className='con-loading'>
        <img src={loading} alt="loading" className='loading' />
      </div>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '25px' }}>
      <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px", fontWeight: 'bold', fontFamily: 'Fira Sans' }}>
        Data Lingkungan Polder
      </Typography>
      <Divider />
      <Box height={10} />
      <PrintDataPDF rows={rows} />
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
              <TableCell align="left" onClick={() => handleSort("debitHulu")}>
                Debit Hulu Citarum (L/min) {sortConfig.key === "debitHulu" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("debitHilir")}>
                Debit Hilir Citarum (L/min) {sortConfig.key === "debitHilir" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaCipalasari")}>
                TMA Sungai Cipalasari (cm) {sortConfig.key === "tmaCipalasari" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaKolam")}>
                TMA Kolam Polder (cm) {sortConfig.key === "tmaKolam" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell align="left" onClick={() => handleSort("tmaCitarum")}>
                TMA Sungai Citarum (cm) {sortConfig.key === "tmaCitarum" && (sortConfig.direction === "asc" ? "↑" : "↓")}
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
                <TableCell align="left">{row.debitHulu}</TableCell>
                <TableCell align="left">{row.debitHilir}</TableCell>
                <TableCell align="left">{row.tmaCipalasari}</TableCell>
                <TableCell align="left">{row.tmaKolam}</TableCell>
                <TableCell align="left">{row.tmaCitarum}</TableCell>
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
