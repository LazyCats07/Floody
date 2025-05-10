import React, { useState, useEffect } from 'react';
import { RealTimeData } from './Reports/Data/RealTimeData';
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase-config";

// MUI Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// Icons
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WavesIcon from '@mui/icons-material/Waves';
import HeightIcon from '@mui/icons-material/Height';
import FloodIcon from '@mui/icons-material/Flood';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// CSS
import "../CSS/Dash.css";

// CountUp Component
import CountUp from 'react-countup';

// Firebase
import { db } from "../firebase-config";
import {
  collection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

// Components
import Navbar from '../Navbar';
import Sidenav from '../Sidenav';
import LineChartSungai from '../LineChartSungai';
import LineChartKolam from '../LineChartKolam';
import PumpButton from '../../components/PumpButton';
import { usePintuAirData } from './Reports/Data/PintuAirData';

  
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
        setPintuAir(data);  // Set data to state
      } else {
        setPintuAir(null);  // If no data, set to null
      }
    });
  }, []);

  const renderCountUp = (value, suffix = '') => {
    return value !== null ? (
      <>
        <CountUp delay={0.4} end={Number(value).toFixed(8)} duration={0.4} />
        <span style={{ marginLeft: '4px' }}>{suffix}</span>
      </>
    ) : (
      <span>Null</span>
    );
  };

  return (
    <>
    <Navbar />
    <Box height={50} />
    <Box sx={{ display: 'flex' }}>
    <Sidenav />
      <Box component ="main" sx={{ flexGrow: 1, p: 3 }} marginLeft={2}>
        <h1>Dashboard Kolam Polder Cipalasari 1</h1>
          <Grid container spacing={2}>
            <Grid size={8}>
              <Stack spacing={2} direction={'row'}>

              <Card sx={{ height: 70 + "vh", minWidth: 99.75 + "%" }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    <b>Prosedur Operasi PINTU AIR & POMPA</b>
                  </Typography>

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
                          <TableCell>
                            <div>Elev. Tutup Pintu +654 M</div>
                            <div>Elev. Buka Pintu +653,5 M</div>
                          </TableCell>
                          <TableCell>
                            <TableCell>
                              <div>P3 ON +654,15 M</div>
                              <div>P2 ON +654,10 M</div>
                              <div>P1 ON +654,05 M</div>
                            </TableCell>
                            <TableCell>
                              <div>P1 OFF +653,9 M</div>
                              <div>P2 OFF +653,8 M</div>
                              <div>P3 OFF +653,7 M</div>
                            </TableCell>
                          </TableCell>
                          <TableCell>
                            <div>Elevasi Batas Mulai Banjir : 656,5 M</div>
                            <div>Elevasi Pintu DITUTUP : 656,5 M</div>
                            <div>Elevasi Pintu DIBUKA : 656,5 M</div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box height={20} />
                  <div>
                    <div><b>Kapasitas Pompa</b> (3 x 0,25 m<sup>3</sup>/det)</div>
                    <div>Diperoleh dari berbagai sumber yang kebenarannya (data definitif) <b>Perlu</b> dipastikan atau disepakati bersama, <b>terutama</b> data luas daerah layanan (DTA = Daerah Tangkapan Air) dan luas kolam retensi yang sangat menentukan beban debit banjir dan <b>Kebutuhan Pompa berikut pola operasinya</b> </div>
                  </div>

                </CardContent>
              </Card>
                  
              </Stack>
            </Grid>

            <Grid size={4}>
              <Card sx={{ height: 60 + "vh", maxWidth: 345 }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    <b>Catatan</b>
                  </Typography>
                  <div>Data teknis berupa:</div>
                  <div>
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
                  <div></div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box height={20} />

          <Grid container spacing={2}>
            {/* Grid 1 */}
            <Grid item size={8}>
              <Stack spacing={2} direction={'row'}>

              <Card sx={{ minWidth: 32.2 + "%", height: 232 }}>
                  <CardContent>
                    <div>
                      <FloodIcon />
                    </div>
                    <Typography gutterBottom variant="h3" component="div">
                      {renderCountUp(tmaKolam, 'm')}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{color: "ccd1d1"}}>
                      Tinggi Air Kolam Polder
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 32.2 + "%", height: 232 }}>
                  <CardContent>
                    <div>
                      <FloodIcon />
                    </div>
                    {/* Tampilan Data TMASungai */}
                    <Typography gutterBottom variant="h3" component="div">
                      {renderCountUp(tmaSungai, 'm')}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{color: "ccd1d1"}}>
                        Tinggi Sungai Citarum
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ minWidth: 32.2 + "%", height: 232 }}>
                  <CardContent>
                    <div>
                      <FloodIcon />
                    </div>
                    {/* Tampilan Data TMASungai */}
                    <Typography gutterBottom variant="h3" component="div">
                      {renderCountUp(tmaHilir, 'm')}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" sx={{color: "ccd1d1"}}>
                        Tinggi Hilir
                    </Typography>
                  </CardContent>
                </Card>
                
              </Stack>
            </Grid>
            
            <Grid item size={4}>
              <Stack spacing={2}>
              <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <WavesIcon />
                      </div>

                      {/* Tampilan Data Debit Sungai */}
                      <div className="paddingAll">
                        <span className="waterValue">{renderCountUp(debitSungai, 'L/min')}</span><br/>
                        <span className='watersubValue'>Debit Sungai Citarum</span>
                      </div>

                    </Stack>
                  </CardContent>
                </Card>
                <Card sx={{ maxWidth: 345 }}>
                  <CardContent>
                    <Stack spacing={2} direction={'row'}>
                      <div className="iconStyle">
                        <WavesIcon />
                      </div>
                      <div className="paddingAll">
                        <span className="waterValue">{renderCountUp(debitKolam, 'L/min')}</span><br/>
                        <span className='watersubValue'>Debit Sungai Polder</span>
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
              <Card sx={{ height: 90 + "vh", maxWidth: 1100}}>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Tinggi Air Kolam Polder Cipalasari 1
                  </Typography>
                  <LineChartKolam />
                </CardContent>
              </Card>

              {/* LineChart Sungai Citarun */}
              <Box height={20} />
              <Card sx={{ height: 90 + "vh", maxWidth: 1100 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Tinggi Air Sungai Citarum
                  </Typography>
                  <LineChartSungai />
                </CardContent>
              </Card>
              <Box height={20} />
            </Grid>

            {/* Menambahkan card line dibawah */}
            
            <Grid item size={4}>
              
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                      <WavesIcon />
                    </div>
                    <div className="paddingAll">
                      {/* Tampilan Data Debit Sungai */}
                      <span className="waterValue">{renderCountUp(debitHilir, 'L/min')}</span><br/>
                      <span className='watersubValue'>Debit Hilir</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Box height={20} />
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                      <ThunderstormIcon />
                    </div>
                    <div className="paddingAll">

                      {/* Tampilan Data Curah Hujan Dayeuhkolot */}
                      <span className="waterValue">{renderCountUp(curahHujanBS, 'mm')}</span><br />
                      {/* Tampilan Data Curah Hujan Dayeuhkolot */}

                      <span className='watersubValue'> Curah Hujan Bojongsoang</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Box height={20} />
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                      <ThunderstormIcon />  
                    </div>
                    <div className="paddingAll">

                      {/* Tampilan Data Curah Hujan Bojongsoang */}
                      <span className="waterValue">{renderCountUp(curahHujanDK, 'mm')}</span><br />
                      {/* Tampilan Data Curah Hujan Bojongsoang */}

                      <span className='watersubValue'>Curah Hujan Dayeuhkolot</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Box height={20} />
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                    <BuildCircleIcon />
                    </div>
                    <div className="paddingAll">

                      {/* Tampilan Data Pompa Aktif */}
                      <span className="waterValue">{renderCountUp(pompa)}</span><br />
                      {/* Tampilan Data Pompa Aktif */}

                      <span className='watersubValue'>Pompa Aktif</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Box height={20} />
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                    <LinearScaleIcon />
                    </div>
                    <div className="paddingAll">

                      {/* Tampilan Bukaan Pintu Air */}
                      <span className="waterValue">{renderCountUp(pintuAir, '%')}</span><br />
                      {/* Tampilan Bukaan Pintu Air */}

                      <span className='watersubValue'>Bukaan Pintu Air</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              <Box height={20} />
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                    <BuildCircleIcon />
                    </div>
                    <div className="paddingAll">
                      <span className='watersubValue'>Pompa Aktif</span>
                      <PumpButton />
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
      </Box>  
    </Box>
    </>
  )
}


