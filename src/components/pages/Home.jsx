import React, { useState, useEffect, useRef } from 'react';
import { RealTimeData } from './Reports/Data/RealTimeData';
import { ref, onValue, set } from "firebase/database";
import { database, auth, db } from "../firebase-config";
import { doc, getDoc } from 'firebase/firestore';
import { RealTimeDataCurahByHour } from './Reports/Data/RealTimeDataCurah3Jam';
import { createTheme } from '@mui/material/styles';
 
// MUI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';

import TMA from '../icon/TMA.gif';
import Debit from '../icon/ocean.gif';
import curah from '../icon/curah.gif';
import flood from '../icon/flood.gif';
import pump from '../icon/pump.gif';
import sliderIcon from '../icon/slider.gif';
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
import Notification from '../notification';
import ProcedureCard from '../../components/ProcedureCard'; 

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
      // const s = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);

      // Hitung waktu +3 jam
      const plus3 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
      const h3 = plus3.getHours().toString().padStart(2, '0');
      const m3 = plus3.getMinutes().toString().padStart(2, '0');
      // const s3 = plus3.getSeconds().toString().padStart(2, '0');
      setTimePlus3Hours(`${h3}:${m3}`);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 1000); // update tiap detik
    return () => clearInterval(intervalId);
  }, []);


  // State for PintuAir
  const [pintuAir, setPintuAir] = useState(0);

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

  // Fungsi untuk memperbarui nilai PintuAir di Firebase
  const updateFirebase = (newValue) => {
    const pintuAirRef = ref(database, 'Kontrol/PintuAir');
    set(pintuAirRef, newValue).catch(console.error);
  };

  const updateTimeoutRef = useRef(null);
  const debouncedSend = (newValue) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      updateFirebase(newValue);
    }, 500);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // tinggi minimum 100% viewport
        }}
      >
        <Notification />
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
              <Grid item size={8}>
                <Stack spacing={2} direction={'row'}>
                  {/* Ganti kode prosedur lama dengan ProcedureCard */}
                  <ProcedureCard processImage={process} />
                </Stack>
              </Grid>
              <Grid item size={4}>
                {/* Kontrol Pompa */}
                <Card sx={{ height: '100%', maxWidth: 345, borderRadius: '25px' }} className='card'>
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
                spacing="auto"
              >
                  <Card sx={{ height: 200, minWidth: 31 + "%", borderRadius: '25px' }} className='cardTMA card'>
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

                  <Card sx={{ height: 200, minWidth: 31+ "%", borderRadius: '25px' }}>
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

                  <Card sx={{ height: 200, minWidth: 31 + "%", borderRadius: '25px' }} className='cardTMA card'>
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
                        <div className="paddingAll" style={{ marginTop: '5px' }}>
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
                        <div className="paddingAll" style={{ marginTop: '5px' }}>
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

                      {/* Tampilan Data Debit hulu Sungai */}
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
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

                      {/* Tampilan Data Debit hilir Sungai citarum */}
                      <div className="paddingAll" style={{ marginTop: '5px' }}  >
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
                      <div className="iconStyle" >
                        <img src={Debit} alt="test" style={{ width: '60px', marginTop: '-20px' }} />
                      </div>

                      {/* Tampilan Data Debit Sungai cipalasari */}
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
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
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
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
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
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
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
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
                      <div className="paddingAll" style={{ marginTop: '5px' }}>
                        <span className="waterValue" style={{ marginBottom: '-105px' }}>
                          {renderCountUp(curahHujanDK, "mm")} | {timePlus3Hours} WIB
                        </span><br />
                        <span className='watersubValue'>Curah Hujan Dayeuhkolot</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, borderRadius: '25px' }} className='card'>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                        <div className="iconStyle">
                          <img src={sliderIcon} alt="test" style={{ width: '60px', marginTop: '-280px' }} />
                        </div>
                        <div
                          className="paddingAll"
                          style={{
                            marginTop: '-5px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px',
                            marginLeft: '0px',
                          }}
                        >
                        <Slider
                          orientation="vertical"
                          track="normal"
                          aria-label="Bukaan Pintu Air"
                          value={typeof pintuAir === 'number' ? pintuAir : 0}
                          onChange={(e, newValue) => {
                            setPintuAir(newValue);
                            debouncedSend(newValue);
                          }}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `${value}%`}
                          step={5}
                          marks={[
                            { value: 0, label: '0%' },
                            { value: 10, label: '' },
                            { value: 20, label: '' },
                            { value: 30, label: '' },
                            { value: 40, label: '' },
                            { value: 50, label: '50%' },
                            { value: 60, label: '' },
                            { value: 70, label: '' },
                            { value: 80, label: '' },
                            { value: 90, label: '' },
                            { value: 100, label: '100%' }
                          ]}
                          sx={{
                            marginTop: 2,
                            height: 200,
                            width: 60,
                            padding: 0,

                            '& .MuiSlider-thumb': {
                              width: 40,
                              height: 20,
                              backgroundColor: 'white',
                              border: '2px solid black',
                              borderRadius: 1, // <- Sudut kotak
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            },

                            '& .MuiSlider-track': {
                              backgroundColor: 'transparent',
                              border: 'none',
                            },

                            '& .MuiSlider-rail': {
                              backgroundColor: '#fff',
                              border: '2px solid black',
                              width: 25,
                              transform: 'translateX(-50%)',
                              borderRadius: 0, // <- Sudut kotak
                            },

                            '& .MuiSlider-mark': {
                              width: 10,
                              height: 1.25,
                              backgroundColor: 'black',
                              marginLeft: 4,
                            },

                            '& .MuiSlider-markLabel': {
                              fontSize: '0.75rem',
                              color: '#000',
                              marginLeft: 5,
                            },

                            '& .MuiSlider-valueLabel': {
                              display: 'none',
                            }
                          }}
                        />

                        <MuiInput
                          value={pintuAir || 0}
                          size="small"
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            if (val === '' || (val >= 0 && val <= 100)) {
                              setPintuAir(val);
                              debouncedSend(val); // Kirim nilai ke database dengan delay 500ms
                            }
                          }}
                          onBlur={() => {
                            let newValue = pintuAir;
                            if (pintuAir === '' || pintuAir < 0) {
                              newValue = 0;
                              setPintuAir(0);
                            } else if (pintuAir > 100) {
                              newValue = 100;
                              setPintuAir(100);
                            }
                            updateFirebase(newValue);
                          }}
                          inputProps={{
                            step: 5,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                            style: {
                              marginTop: '10px',
                              textAlign: 'center',
                              padding: '8px 14px',
                              borderRadius: 10,
                              border: '2px solid #1976d2',
                              fontWeight: '700',
                              fontSize: '1.1rem',
                              width: 60,
                              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.12)'
                            }
                          }}
                          sx={{
                            '&:hover': {
                              '& input': {
                                borderColor: '#115293'
                              }
                            },
                            '& input:focus': {
                              borderColor: '#115293',
                              outline: 'none',
                              boxShadow: '0 0 8px #90caf9'
                            }
                          }}
                        />
                        <span className="watersubValue" style={{ marginTop: '10px' }} >Bukaan Pintu Air</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>

                <Box height={20} />
                <Card sx={{ maxWidth: 345, borderRadius: '25px' }}>
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
