import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// import "../CSS/Dash.css"
// import WaterDropIcon from '@mui/icons-material/WaterDrop';
// import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import WavesIcon from '@mui/icons-material/Waves';
// import HeightIcon from '@mui/icons-material/Height';
// import FloodIcon from '@mui/icons-material/Flood';
// import CountUp from 'react-countup';
// import { useCountUp }  from 'react-countup'; 
// import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import notes from '../icon/notes.gif';
import { useEffect, useState } from 'react';


// Component
import Navbar from '../Navbar';
import Sidenav from '../Sidenav'
// import '../PumpButton'
// import '../SliderDoor'
import SliderDoor from '../SliderDoor';
import PumpButton from '../PumpButton';
import process from '../icon/process.gif';
import Footer from '../Footer';


export default function Controller() {
  useEffect(() => {
    document.title = "Floody - Controller";
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
    <Box sx={{ display: 'flex' }} className='bg'>
    <Sidenav />
      <Box component ="main" sx={{ flexGrow: 1, p: 3 }} marginLeft={2} >
        <h1>Sistem Kontrol</h1>
        <p style={{ color: 'white', fontWeight: 'bold', marginTop: '-20px' }}>
          {currentDateTime}
        </p>
        <Grid container spacing={2}>
            <Grid size={8}>
              <Stack spacing={2} direction={'row'}>

<Card sx={{ height: '80vh', width: '100%', borderRadius: '25px', overflowX: 'auto' }}>
  <CardContent>
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <img src={process} alt="icon" style={{ width: '70px', margin: '0 10px -20px 10px' }} />
      <b style={{ fontSize: '30px' }}>Prosedur Operasi Pintu Air dan Pompa</b>
    </span>

    <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
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
        <p style={{ fontSize: '18px', color: 'black', marginTop: '-10px', textAlign: 'justify' }}>
          Diperoleh dari berbagai sumber yang  kebenarannya (data definitif) <b>Perlu</b> dipastikan atau disepakati bersama,
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
              <Card sx={{ height: '80vh', width: '100%', borderRadius: '25px' }}>
                <CardContent>
                  <span>
                    <img src={notes} alt="icon" style={{ width: '65px', marginRight: '10px', marginLeft: '10px', marginBottom: '-20px' }}/>
                    <b style={{ fontSize: '25px' }}>Catatan</b>
                  </span>
                  <div style={{ marginTop: '25px', fontSize: '18px' }}><b>Berikut adalah data teknis berupa:</b></div>
                  <div>
                    <ol>
                      <div><li>Luas Daerah Layanan Kolam Polder</li></div>
                      <div>(2000 cm²)</div>
                      <div><li>Volume Tampungan Kolam Polder</li></div>
                      <div>(40000 cm<sup>3</sup>)</div>
                      <div><li>Kapasitas Pompa</li></div>
                      <div>(3 x 1,5 L/min) atau (3 x 0,000025 m<sup>3</sup>/s)</div>
                      <div></div>
                    </ol>
                  </div>
                  <div></div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box height={20} />


        <Grid container spacing={2}>
          {/* Kontrol Pintu Air */}
          <Grid size={8}>
            <Card sx={{ height: 50 + "vh", maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%"}}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                  Kontrol Pintu Air
                </Typography>
                <div sx={{ display: 'flex' }}>
                  <SliderDoor />
                </div>
              </CardContent>
            </Card>
            <Box height={20} />
          </Grid>

          <Grid size={4}>
            <Card sx={{ height:  50 + "vh", borderRadius: '25px'}}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold'}}>
                  Kontrol Pompa
                </Typography>
                <PumpButton />
              </CardContent>
            </Card>
          </Grid>
        
          {/* Kontrol Pompa */}
          <Grid size={8}>
          </Grid>

          <Grid size={4}>
          </Grid>

        </Grid>
      </Box>  
    </Box>
    <Footer/>
    </Box>
    </>
  )
}


