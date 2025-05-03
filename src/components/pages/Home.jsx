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
  
export default function Home() {
  const [tmaSungai, setTmaSungai] = useState(null);
  const [tmaKolam, setTmaKolam] = useState(null);
  const [debitSungai, setDebitSungai] = useState(null);
  const [debitKolam, setDebitKolam] = useState(null);
  const [curahHujan, setCurahHujan] = useState(null);
  const [pompa, setPompa] = useState(null);
  const [tmaHilir, setTmaHilir] = useState(null);


  useEffect(() => {
    RealTimeData({
      tmaSungai: setTmaSungai,
      tmaKolam: setTmaKolam,
      debitSungai: setDebitSungai,
      debitKolam: setDebitKolam,
      curahHujan: setCurahHujan,
      pompa: setPompa,
      tmaHilir: setTmaHilir
  });

  // 🔎 Tes manual ambil data
  const tmaRef = ref(database, "Polder/TMA_Sungai");
  get(tmaRef)
    .then(snapshot => {
      const data = snapshot.val();
      console.log("🔥 Snapshot manual TMA_Sungai:", data);
      if (data) {
        const lastKey = Object.keys(data).sort().pop();
        console.log("✅ Last Key:", lastKey);
        console.log("✅ Last Value:", data[lastKey]);
      } else {
        console.warn("⚠️ Tidak ada data di TMA_Sungai");
      }
    })
    .catch(error => {
      console.error("❌ Gagal ambil data manual:", error);
    });
  }, []);

    // Helper
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
                        <span className="waterValue">{renderCountUp(debitSungai, 'm³/s')}</span><br/>
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
                        <span className="waterValue">{renderCountUp(debitKolam, 'm³/s')}</span><br/>
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
              <Card sx={{ height: 85 + "vh", maxWidth: 1100}}>
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Tinggi Air Kolam Polder Cipalasari 1
                  </Typography>
                  <LineChartKolam />
                </CardContent>
              </Card>
              <Box height={20} />
              <Card sx={{ height: 85 + "vh", maxWidth: 1100 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Tinggi Air Sungai Citarum
                  </Typography>
                  <LineChartSungai />
                </CardContent>
              </Card>
              <Box height={20} />
            </Grid>

            
            <Grid item size={4}>
              
              

              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2} direction={'row'}>
                    <div className="iconStyle">
                      <WavesIcon />
                    </div>
                    <div className="paddingAll">

                      {/* Tampilan Model Banjir */}
                      {/* <span className="waterValue">{renderCountUp(curahHujan, 'mm')}</span><br /> */}
                      <span className="waterValue">Banjir</span><br />
                      {/* Tampilan Model Banjir */}

                      <span className='watersubValue'> Status Banjir</span>
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
                      <span className="waterValue">{renderCountUp(curahHujan, 'mm')}</span><br />
                      {/* Tampilan Data Curah Hujan Dayeuhkolot */}

                      <span className='watersubValue'> Curah Hujan Dayeuhkolot</span>
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
                      <span className="waterValue">{renderCountUp(curahHujan, 'mm')}</span><br />
                      {/* Tampilan Data Curah Hujan Bojongsoang */}

                      <span className='watersubValue'>Curah Hujan Bojongsoang</span>
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


