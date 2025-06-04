import React, { useState, useEffect } from 'react';
import { RealTimeData } from './Reports/Data/RealTimeData';
import { ref, onValue } from "firebase/database";
import { database, auth, db } from "../firebase-config";
import { doc, getDoc } from 'firebase/firestore';
import { RealTimeDataCurahByHour } from './Reports/Data/RealTimeDataCurah3Jam';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// Icons
// import WaterDropIcon from '@mui/icons-material/WaterDrop';
// import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import WavesIcon from '@mui/icons-material/Waves';
// import HeightIcon from '@mui/icons-material/Height';
// import FloodIcon from '@mui/icons-material/Flood';
// import BuildCircleIcon from '@mui/icons-material/BuildCircle';
// import LinearScaleIcon from '@mui/icons-material/LinearScale';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import TMA from '../icon/TMA.gif';
import Debit from '../icon/ocean.gif';
import curah from '../icon/curah.gif';
import flood from '../icon/flood.gif';
import pump from '../icon/pump.gif';
import slider from '../icon/slider.gif';
import button from '../icon/button.gif';
import process from '../icon/process.gif';

// CSS
import "../CSS/Dash.css";

// CountUp Component
import CountUp from 'react-countup';

// Components
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';
import LineChartDebit from '../LineChartDebit';
import LineChartTMA from '../LineChartTMA';
import LineChartCurah from '../LineChartCurah';
import PumpButton from '../../components/PumpButton';
import Footer from '../Footer';
// import { usePintuAirData } from './Reports/Data/PintuAirData';

export default function Home() {
  const [tmaCipalasari, setTmaCipalasari] = useState(null);
  const [tmaKolam, setTmaKolam] = useState(null);
  const [tmaCitarum, setTmaCitarum] = useState(null);
  const [debitHulu, setDebitHulu] = useState(null);
  const [debitCipalasari, setDebitCipalasari] = useState(null);
  const [debitHilir, setDebitHilir] = useState(null);
  const [curahHujanBS, setCurahHujanBS] = useState(null);
  const [curahHujanDK, setCurahHujanDK] = useState(null);
  const [pompa, setPompa] = useState(null);
  const [statusBanjir, setStatusBanjir] = useState(null);
  
  // State untuk Jam Saat Ini
  const [currentTime, setCurrentTime] = useState('');

  // State untuk waktu +3 jam
  const [timePlus3Hours, setTimePlus3Hours] = useState('');

  // Data curah hujan saat ini
  const [curahHujanBS3Jam, setCurahHujanBS3Jam] = useState([]);
  const [curahHujanDK3Jam, setCurahHujanDK3Jam] = useState([]);

  useEffect(() => {
    RealTimeData({
      tmaCipalasari: setTmaCipalasari,
      tmaKolam: setTmaKolam,
      tmaCitarum: setTmaCitarum,
      debitHulu: setDebitHulu,
      debitCipalasari: setDebitCipalasari,
      debitHilir: setDebitHilir,
      curahHujanBS: setCurahHujanBS,
      curahHujanDK: setCurahHujanDK,
      pompa: setPompa,
      statusBanjir: setStatusBanjir,
    });
  }, []);

  useEffect(() => {
    RealTimeDataCurahByHour({
      curahHujanBS: setCurahHujanBS3Jam,
      curahHujanDK: setCurahHujanDK3Jam,
    }, 0); // 0 artinya jam penuh sekarang
  }, []);


  // State untuk waktu +3 jam
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      // Format jam:menit:detik, misal 17:32:45
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);

      // Hitung waktu +3 jam
      const plus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const h3 = plus3.getHours().toString().padStart(2, '0');
      const m3 = plus3.getMinutes().toString().padStart(2, '0');
      const s3 = plus3.getSeconds().toString().padStart(2, '0');
      setTimePlus3Hours(`${h3}:${m3}`);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 1000); // update tiap detik
    return () => clearInterval(intervalId);
  }, []);


  // State for PintuAir
  const [pintuAir, setPintuAir] = useState(null);

  useEffect(() => {
    // Firebase reference to the PintuAir node
    const pintuAirRef = ref(database, 'Kontrol/PintuAir');

    // Subscribe to data updates using onValue
    onValue(pintuAirRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setPintuAir(data); // Set data to state
      } else {
        setPintuAir(null); // If no data, set to null
      }
    });
  }, []);

  const renderCountUp = (value, suffix = '') => {
      if (value !== null && !isNaN(value)) {
          const formattedValue = Number(value.toFixed(2)); // Pastikan nilai hanya 2 angka di belakang koma
          console.log('Formatted Value:', formattedValue);
          return (
              <>
                  <CountUp 
                      delay={0.4} 
                      end={formattedValue} 
                      duration={0.4} 
                      decimals={2} 
                  />
                  <span style={{ marginLeft: '4px' }}>{suffix}</span>
              </>
          );
      } else {
          return <span>Null</span>;
      }
  };

  const [userDetails, setUserDetails] = useState(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Fetch user details on mount
  const fetchUserDetails = async () => {
    auth.onAuthStateChanged(async (user) => {
      setUserDetails(user);
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User is not Logged in");
        }
      }
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    // Set a timer to mark the animation as finished
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 2500); // Set this to the duration of your typing animation (e.g., 2.5 seconds)

    return () => clearTimeout(timer); // Clear the timer when the component is unmounted
  }, []);

  useEffect(() => {
    document.title = "Floody - Home";
  }, []);


    const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();

      // Format hari dalam bahasa Indonesia
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const dayName = days[now.getDay()];
      const date = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();

      // Format waktu dengan 2 digit
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const formatted = `${dayName}, ${date} ${monthName} ${year} | ${hours}:${minutes}:${seconds}`;
      setCurrentDateTime(formatted);
    }

    updateDateTime(); // set awal
    const intervalId = setInterval(updateDateTime, 1000); // update tiap detik

    return () => clearInterval(intervalId);
  }, []);


  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg0: 1180,
        lg: 1280,
        xl: 1920
      }
    }
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // tinggi minimum 100% viewport
        }}
      >
        <Navbar />
        <Box height={50} />
        <Box sx={{ display: 'flex' }} className='HomeBG'>
          <Sidenav />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
            }}
            marginLeft={2}
          >
            <h1 className='HomeTitle' style={{ textAlign: 'center', fontSize: '50px' }}>
              Dashboard Kolam Polder Cipalasari 1
            </h1>
            <p
              style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginTop: '-40px', color: 'yellow' }}
              className={`typewriter ${animationFinished ? 'finished' : ''}`}
            >
              Selamat datang <b>{userDetails?.firstName}</b> !!!
            </p>
            <p style={{ color: 'white', fontWeight: 'bold', marginTop: '-20px' }}>
              {currentDateTime}
            </p>
            <Grid container spacing={2}>
              <Grid size={8}>
                <Stack spacing={2} direction={'row'}>
                  <Card
                    sx={{
                      height: 'auto',
                      width: '100%',
                      borderRadius: '25px',
                      overflowX: 'auto',
                    }}
                  >
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={process} alt="icon" style={{ width: '70px', margin: '-5 10px 10px 0' }} />
                        <b style={{ fontSize: '30px', marginTop: '15px', marginLeft: '10px' }}>Prosedur Operasi Pintu Air dan Pompa</b>
                      </span>

                      <TableContainer sx={{ maxHeight: 440, marginTop: 1 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontSize: '18px' }}><b>Pintu Air (Tinggi Dalam Polder)</b></TableCell>
                                <TableCell sx={{ fontSize: '18px' }}><b>Pompa (Tinggi Dalam Polder)</b></TableCell>
                                <TableCell sx={{ fontSize: '18px' }}><b>Sungai Citarum</b></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ wordBreak: 'break-word', fontSize: '16px' }}>
                                <div>Elevasi Tutup Pintu: <b>+8 cm</b></div>
                                <div>Elevasi Buka Pintu: <b>+6 cm</b></div>
                              </TableCell>
                              <TableCell sx={{ wordBreak: 'break-word', fontSize: '16px'  }}>
                                <div><b>POMPA ON</b></div>
                                <div>Pompa 3 ON <b>+8.6 cm</b></div>
                                <div>Pompa 2 ON <b>+8.4 cm</b></div>
                                <div>Pompa 1 ON <b>+8.2 cm</b></div>
                                <div style={{ marginTop: '8px'}}><b>POMPA OFF</b></div>
                                <div>Pompa 1 OFF <b>+7.6 cm</b></div>
                                <div>Pompa 2 OFF <b>+7.2 cm</b></div>
                                <div>Pompa 3 OFF <b>+6.8 cm</b></div>
                              </TableCell>
                              <TableCell sx={{ wordBreak: 'break-word', fontSize: '16px'  }}>
                                <div>Elevasi batas mulai banjir</div>
                                <div><b>+18 cm</b></div>
                                <div>Elevasi pintu <u>ditutup</u></div>
                                <div><b>+18 cm</b></div>
                                <div>Elevasi pintu <u>dibuka</u></div>
                                <div><b>+12 cm</b></div>

                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box height={20} />

                      <div className="kapasitas-info">
                        <blockquote>
                          <p style={{ fontSize: '18px', marginTop: '-10px', textAlign: 'justify'}}>
                            Diperoleh dari berbagai sumber yang kebenarannya (data definitif) <b>Perlu</b> dipastikan atau disepakati bersama,
                            <b> terutama </b> data luas daerah layanan (DTA = Daerah Tangkapan Air) dan luas kolam retensi yang sangat menentukan beban debit banjir
                            dan <b>kebutuhan pompa berikut pola operasinya.</b>
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid size={4}>
                <Card sx={{height: '100%', maxWidth: 345, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <span>
                      <img src={button} alt="icon" style={{ width: '70px', marginRight: '10px', marginLeft: '10px', marginBottom: '-20px' }} />
                      <b style={{ fontSize: '30px' }}>Kontrol Pompa</b>
                    </span>
                    <Box height={27} />
                    <PumpButton />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box height={20} />

            <Grid container spacing={2}>
              {/* Grid 1 */}
              <Grid item size={8}>
              <Stack
                direction="row"
                spacing={{ 
                  xs: 1,    // Spacing kecil untuk layar kecil (smartphones)
                  sm: 1.2,  // Sedikit lebih besar untuk layar medium (tablet)
                  md: 1.4,    // Lebih besar lagi untuk layar sedang
                  lg0: 1.6,
                  lg: 2.2  // Spacing default untuk layar besar
                }}
              >
                  <Card sx={{ height: 200, minWidth: 32 + "%", borderRadius: '25px' }} className='cardTMA card'>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-20px' }} />
                        <Typography
                          gutterBottom
                          component="div"
                          className="countText"
                          sx={{
                            fontSize: {
                              xs: '20px',  // for extra small screens (smartphones)
                              sm: '25px',  // for small screens
                              md: '32px',  // for medium screens
                              lg: '40px'   // for large screens
                            },
                            marginTop: '30px'
                          }}
                        >
                          {renderCountUp(tmaKolam, 'cm')}
                        </Typography>
                      </span>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '20px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '24px',  // untuk ukuran layar kecil
                            md: '28px',  // untuk ukuran layar sedang
                            lg: '32px'   // untuk ukuran layar besar
                          },
                          marginTop: {
                            xs: '-10px',  // for extra small screens
                            sm: '-15px',  // for small screens
                            md: '-22px',  // for medium screens
                            lg: '-30px'   // for large screens
                          },
                          marginLeft: '5px'
                        }}
                      >
                        Tinggi Air
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '16px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '18px',  // untuk ukuran layar kecil
                            md: '20px',  // untuk ukuran layar sedang
                            lg: '22px'   // untuk ukuran layar besar
                          },
                          marginTop: '-20px',
                          marginLeft: '5px'
                        }}
                      >
                        Kolam Polder
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: 200, minWidth: 32 + "%", borderRadius: '25px' }}>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-20px' }} />
                        <Typography
                          gutterBottom
                          component="div"
                          className="countText"
                          sx={{
                            fontSize: {
                              xs: '20px',  // for extra small screens (smartphones)
                              sm: '25px',  // for small screens
                              md: '32px',  // for medium screens
                              lg: '40px'   // for large screens
                            },
                            marginTop: '30px'
                          }}
                        >
                          {renderCountUp(tmaCitarum, 'cm')}
                        </Typography>
                      </span>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '20px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '24px',  // untuk ukuran layar kecil
                            md: '28px',  // untuk ukuran layar sedang
                            lg: '32px'   // untuk ukuran layar besar
                          },
                          marginTop: {
                            xs: '-10px',  // for extra small screens
                            sm: '-15px',  // for small screens
                            md: '-22px',  // for medium screens
                            lg: '-30px'   // for large screens
                          },
                          marginLeft: '5px'
                        }}
                      >
                        Tinggi Air
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '16px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '18px',  // untuk ukuran layar kecil
                            md: '20px',  // untuk ukuran layar sedang
                            lg: '22px'   // untuk ukuran layar besar
                          },
                          marginTop: '-20px',
                          marginLeft: '5px'
                        }}
                      >
                        Sungai Citarum
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: 200, minWidth: 32 + "%", borderRadius: '25px' }} className='cardTMA card'>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-20px' }} />
                        <Typography
                          gutterBottom
                          component="div"
                          className="countText"
                          sx={{
                            fontSize: {
                              xs: '20px',  // for extra small screens (smartphones)
                              sm: '25px',  // for small screens
                              md: '32px',  // for medium screens
                              lg: '40px'   // for large screens
                            },
                            marginTop: '30px'
                          }}
                        >
                          {renderCountUp(tmaCipalasari, 'cm')}
                        </Typography>
                      </span>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '20px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '24px',  // untuk ukuran layar kecil
                            md: '28px',  // untuk ukuran layar sedang
                            lg: '32px'   // untuk ukuran layar besar
                          },
                          marginTop: {
                            xs: '-10px',  // for extra small screens
                            sm: '-15px',  // for small screens
                            md: '-22px',  // for medium screens
                            lg: '-30px'   // for large screens
                          },
                          marginLeft: '5px'
                        }}
                      >
                        Tinggi Air
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                          color: "ccd1d1",
                          fontSize: {
                            xs: '16px',  // untuk ukuran layar sangat kecil (smartphone)
                            sm: '18px',  // untuk ukuran layar kecil
                            md: '20px',  // untuk ukuran layar sedang
                            lg: '22px'   // untuk ukuran layar besar
                          },
                          marginTop: '-20px',
                          marginLeft: '5px'
                        }}
                      >
                        Sungai Cipalasari
                      </Typography>
                    </CardContent>
                  </Card>

                </Stack>
              </Grid>

              <Grid item size={4}>
                <Stack spacing={2}>
                  <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }}>
                    <CardContent>
                      <Stack spacing={2} direction={'row'}>
                        <div className="iconStyle">
                          <img src={flood} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                        </div>

                        {/* Tampilan Data Debit Sungai */}
                        <div className="paddingAll">
                          <span className="waterValue">Siaga {renderCountUp(statusBanjir)}</span><br />
                          <span className='watersubValue'>Status Banjir</span>
                        </div>

                      </Stack>
                    </CardContent>
                  </Card>
                  <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }}>
                    <CardContent>
                      <Stack spacing={2} direction={'row'}>
                        <div className="iconStyle">
                          <img src={pump} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                        </div>
                        <div className="paddingAll">
                          <span className="waterValue">{renderCountUp(pompa)}</span><br />
                          <span className='watersubValue'>Pompa Aktif</span>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>

            {/* Grid 2 */}
            <Box height={20} />
            <Grid container spacing={2}>
              <Grid item size={8}>
                {/* LineChart TMA Polder */}
                <Card sx={{ height: 'auto', maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                      Tinggi Air Lingkungan Polder Cipalasari 1
                    </Typography>
                    <LineChartTMA />
                  </CardContent>
                </Card>

                {/* LineChart Debit Polder */}
                <Box height={20} />
                <Card sx={{ height: 'auto', maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                      Debit air Sungai Lingkungan Polder Cipalasari 1
                    </Typography>
                    <LineChartDebit />
                  </CardContent>
                </Card>
                <Box height={20} />

                {/* LineChart Curah Hujan */}
                <Card sx={{ height: 'auto', maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                      Curah Hujan
                    </Typography>
                    <LineChartCurah />
                  </CardContent>
                </Card>
                <Box height={20} />
              </Grid>

              {/* Menambahkan card line dibawah */}
              <Grid item size={4}>

                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={Debit} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(debitHulu, 'L/min')}</span><br />
                        <span className='watersubValue'>Debit Hulu Sungai Citarum</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={Debit} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(debitHilir, 'L/min')}</span><br />
                        <span className='watersubValue'>Debit Hilir Sungai Citarum</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={Debit} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(debitCipalasari, 'L/min')}</span><br />
                        <span className='watersubValue'>Debit Sungai Cipalasari</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>                
                <Box height={20} />

                                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={curah} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                      </div>

                      {/* Tampilan Data Curah Hujan Bojongsoang */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>
                          {curahHujanBS3Jam?.[0]?.value !== undefined
                            ? <>
                                {renderCountUp(curahHujanBS3Jam[0].value, "mm")} | {currentTime} WIB
                              </>
                            : <>Null | {currentTime} WIB</>}
                        </span><br />
                        <span className='watersubValue'>Curah Hujan Bojongsoang</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={curah} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                      </div>

                      {/* Tampilan Data Curah Hujan Dayeuhkolot */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>
                          {curahHujanDK3Jam?.[0]?.value !== undefined
                            ? <>
                                {renderCountUp(curahHujanDK3Jam[0].value, "mm")} | {currentTime} WIB
                              </>
                            : <>Null | {currentTime} WIB</>}
                        </span><br />
                        <span className='watersubValue'>Curah Hujan Dayeuhkolot</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>
                <Box height={20} />
                      
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={curah} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                      </div>

                      {/* Tampilan Data Curah Hujan Bojongsoang */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>
                          {renderCountUp(curahHujanBS, "mm")} | {timePlus3Hours} WIB
                        </span><br />
                        <span className='watersubValue'>Curah Hujan Bojongsoang</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={curah} alt="test" style={{ width: '60px', marginTop: '-26px' }} />
                      </div>

                      {/* Tampilan Data Curah Hujan Dayeuhkolot */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>
                          {renderCountUp(curahHujanDK, "mm")} | {timePlus3Hours} WIB
                        </span><br />
                        <span className='watersubValue'>Curah Hujan Dayeuhkolot</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, maxHeight: 92, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={slider} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(pintuAir, '%')}</span><br />
                        <span className='watersubValue'>Bukaan Pintu Air</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, borderRadius: '25px' }}>
                  {/* <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyleButton">
                        <img src={button} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>
                      <div className="paddingAll">
                        <span className='watersubValue' style={{ fontWeight: '500' }}>Kontrol Pompa</span>
                        <PumpButton />
                      </div>
                    </Stack>
                  </CardContent> */}
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
