import React, { useState, useEffect } from 'react';
import { RealTimeData } from './Reports/Data/RealTimeData';
import { ref, onValue } from "firebase/database";
import { database, auth, db } from "../firebase-config";
import { doc, getDoc } from 'firebase/firestore';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
  const [tmaSungai, setTmaSungai] = useState(null);
  const [tmaKolam, setTmaKolam] = useState(null);
  const [tmaHilir, setTmaHilir] = useState(null);
  const [debitSungai, setDebitSungai] = useState(null);
  const [debitKolam, setDebitKolam] = useState(null);
  const [debitHilir, setDebitHilir] = useState(null);
  const [curahHujanBS, setCurahHujanBS] = useState(null);
  const [curahHujanDK, setCurahHujanDK] = useState(null);
  const [pompa, setPompa] = useState(null);
  const [statusBanjir, setstatusBanjir] = useState(null);

  useEffect(() => {
    RealTimeData({
      tmaSungai: setTmaSungai,
      tmaKolam: setTmaKolam,
      tmaHilir: setTmaHilir,
      debitSungai: setDebitSungai,
      debitKolam: setDebitKolam,
      debitHilir: setDebitHilir,
      curahHujanBS: setCurahHujanBS,
      curahHujanDK: setCurahHujanDK,
      pompa: setPompa,
      statusBanjir: setstatusBanjir,
    });
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
      const formattedValue = value.toFixed(2); // Format the value to 2 decimal places
      console.log('Formatted Value:', formattedValue); // Log formatted value for debugging

      return (
        <>
          <CountUp delay={0.4} end={Number(formattedValue)} duration={0.4} />
          <span style={{ marginLeft: '4px' }}>{suffix}</span>
        </>
      );
    } else {
      return <span>Null</span>; // Handle null or non-numeric values
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

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // tinggi minimum 100% viewport
        }}
      >
        <SpeedInsights />
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
              Welcome <b>{userDetails?.firstName}</b>
            </p>
            <Grid container spacing={2}>
              <Grid size={8}>
                <Stack spacing={2} direction={'row'}>
                  <Card sx={{ height: '90vh', width: '100%', borderRadius: '25px', overflowX: 'auto' }}>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={process} alt="icon" style={{ width: '70px', margin: '0 10px -20px 10px' }} />
                        <b style={{ fontSize: '30px' }}>Prosedur Operasi Pintu Air dan Pompa</b>
                      </span>

                      <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell><b>Pintu Air (Tinggi Dalam Polder)</b></TableCell>
                              <TableCell><b>Pompa (Tinggi Dalam Polder)</b></TableCell>
                              <TableCell><b>Sungai Citarum</b></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ wordBreak: 'break-word' }}>
                                <div>Elev. Tutup Pintu +654 M</div>
                                <div>Elev. Buka Pintu +653,5 M</div>
                              </TableCell>
                              <TableCell sx={{ wordBreak: 'break-word' }}>
                                <div><b>POMPA ON</b></div>
                                <div>P3 ON +654,15 M</div>
                                <div>P2 ON +654,10 M</div>
                                <div>P1 ON +654,05 M</div>
                                <div style={{ marginTop: '8px' }}><b>POMPA OFF</b></div>
                                <div>P1 OFF +653,9 M</div>
                                <div>P2 OFF +653,8 M</div>
                                <div>P3 OFF +653,7 M</div>
                              </TableCell>
                              <TableCell sx={{ wordBreak: 'break-word' }}>
                                <div>Elevasi Batas Mulai Banjir : 656,5 M</div>
                                <div>Elevasi Pintu DITUTUP : 656,5 M</div>
                                <div>Elevasi Pintu DIBUKA : 656,5 M</div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box height={20} />

                      <div className="kapasitas-info">
                        <blockquote>
                          <p><b>Kapasitas Pintu Air</b> (3 x 0,25 m<sup>3</sup>/det)</p>
                          <p>
                            Diperoleh dari berbagai sumber yang kebenarannya (data definitif) <b>Perlu</b> dipastikan atau disepakati bersama,
                            <b> terutama </b> data luas daerah layanan (DTA = Daerah Tangkapan Air) dan luas kolam retensi yang sangat menentukan beban debit banjir
                            dan <b> Kebutuhan Pompa berikut pola operasinya.</b>
                          </p>
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid size={4}>
                <Card sx={{ height: 90 + "vh", maxWidth: 345, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <span>
                      <img src={button} alt="icon" style={{ width: '70px', marginRight: '10px', marginLeft: '10px', marginBottom: '-20px' }} />
                      <b style={{ fontSize: '30px' }}>Kontrol Pompa</b>
                    </span>
                    <Box height={27} />
                    {/* <div style={{ marginTop: '10px' }}>Data teknis berupa:</div> */}
                    {/* <div>
                      <ol>
                        <div><li>Luas Daerah Layanan Polder</li></div>
                        <div>(2,00 Ha)</div>
                        <div><li>Volume Tampungan Kolam Retensi</li></div>
                        <div>(1.250 m<sup>3</sup>)</div>
                        <div><li>Luas Kolam Retensi</li></div>
                        <div>(0,03 Ha atau 300 m<sup>2</sup>)</div>
                        <div><li>Kapasitas Pompa</li></div>
                        <div>(3 x 0,25 m<sup>3</sup>/det) atau</div>
                        <div>(3 x 15.000 L/menit)</div>
                      </ol>
                    </div>
                    <div></div> */}
                    <PumpButton />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box height={20} />

            <Grid container spacing={2}>
              {/* Grid 1 */}
              <Grid item size={8}>
                <Stack spacing={2} direction={'row'}>

                  <Card sx={{ height: 200, minWidth: 32.5 + "%", borderRadius: '25px' }} className='cardTMA card'>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-30px' }} />
                        <Typography gutterBottom component="div" className='countText' style={{ fontSize: '45px', marginTop: '20px' }}>
                          {renderCountUp(tmaKolam, 'cm')}
                        </Typography>
                      </span>
                      <Typography gutterBottom variant="h5" component="div" sx={{ color: "ccd1d1" }} style={{ marginTop: '-30px', marginLeft: '5px' }}>
                        Tinggi Air Kolam Polder
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: 200, minWidth: 32 + "%", borderRadius: '25px' }}>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-30px' }} />
                        <Typography gutterBottom component="div" className='countText' style={{ fontSize: '45px', marginTop: '20px' }}>
                          {renderCountUp(tmaHilir, 'cm')}
                        </Typography>
                      </span>
                      <Typography gutterBottom variant="h5" component="div" sx={{ color: "ccd1d1" }} style={{ marginTop: '-30px', marginLeft: '5px' }}>
                        Tinggi Air Sungai Citarum
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card sx={{ height: 200, minWidth: 32 + "%", borderRadius: '25px' }} className='cardTMA card'>
                    <CardContent>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={TMA} alt="test" className='iconFL' style={{ marginRight: '10px', marginTop: '-30px' }} />
                        <Typography gutterBottom component="div" className='countText' style={{ fontSize: '45px', marginTop: '20px' }}>
                          {renderCountUp(tmaSungai, 'cm')}
                        </Typography>
                      </span>
                      <Typography gutterBottom variant="h5" component="div" sx={{ color: "ccd1d1" }} style={{ marginTop: '-30px', marginLeft: '5px' }}>
                        Tinggi Air Sungai Cipalasari
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
                <Card sx={{ height: 90 + "vh", maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                      Tinggi Air Lingkungan Polder Cipalasari 1
                    </Typography>
                    <LineChartTMA />
                  </CardContent>
                </Card>

                {/* LineChart Debit Polder */}
                <Box height={20} />
                <Card sx={{ height: 90 + "vh", maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" style={{ fontSize: '30px', fontWeight: 'bold' }}>
                      Debit air Sungai Lingkungan Polder Cipalasari 1
                    </Typography>
                    <LineChartDebit />
                  </CardContent>
                </Card>
                <Box height={20} />

                {/* LineChart Curah Hujan */}
                <Card sx={{ height: 90 + "vh", maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%" }} className='card'>
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
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(debitSungai, 'L/min')}</span><br />
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
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(debitKolam, 'L/min')}</span><br />
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

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(curahHujanBS, "mm")}</span><br />
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

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>{renderCountUp(curahHujanDK, "mm")}</span><br />
                        <span className='watersubValue'>Curah Hujan Dayeuhkolot</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                {/* <Box height={20} />
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <img src={curah} alt="test" style={{ width: '35px', marginTop: '-5px' }} />
                      </div>
                      <div className="paddingAll">

                        {/* Tampilan Data Curah Hujan Dayeuhkolot */}
                        {/* <span className="waterValue">{renderCountUp(curahHujanBS, 'mm')}</span><br /> */}
                        {/* Tampilan Data Curah Hujan Dayeuhkolot */}

                        {/* <span className='watersubValue'> Curah Hujan Bojongsoang</span>
                      </div>
                    </Stack>
                  </CardContent>
                </Card> */}

                {/* <Box height={20} />
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <BuildCircleIcon />
                      </div>
                      <div className="paddingAll"> */}

                        {/* Tampilan Data Pompa Aktif */}
                        {/* <span className="waterValue">{renderCountUp(pompa)}</span><br /> */}
                        {/* Tampilan Data Pompa Aktif */}

                        {/* <span className='watersubValue'>Pompa Aktif</span>
                      </div>
                    </Stack>
                  </CardContent>
                </Card> */}

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

                {/* 
                <Box height={20} />
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <LinearScaleIcon />
                      </div>
                      <div className="paddingAll"> */}

                        {/* Tampilan Bukaan Pintu Air */}
                        {/* <span className="waterValue">{renderCountUp(pintuAir, '%')}</span><br /> */}
                        {/* Tampilan Bukaan Pintu Air */}
                        {/* 
                        <span className='watersubValue'>Bukaan Pintu Air</span>
                      </div>
                    </Stack>
                  </CardContent>
                </Card> */}

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
                {/* <SpeedInsight url="https://floody-eta.vercel.app" /> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
