import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import notes from '../icon/notes.gif';
import { useEffect, useState } from 'react';
import ProcedureCard from '../ProcedureCard';
// import Notification from '../notification';


// Component
import Navbar from '../Navbar';
import Sidenav from '../Sidenav'
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
      {/* <Notification /> */}

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
                <Card
                  sx={{
                    height: 'auto',
                    width: '100%',
                    borderRadius: '25px',
                    overflowX: 'auto',
                  }}
                >
                  {/* Ganti kode prosedur lama dengan ProcedureCard */}
                  <ProcedureCard processImage={process} />
                </Card>    
              </Stack>
            </Grid>

            <Grid size={4}>
              <Card sx={{ height: '100%', width: '100%', borderRadius: '25px' }}>
                <CardContent>
                  <span>
                    <img src={notes} alt="icon" style={{ width: '65px', marginRight: '10px', marginLeft: '10px', marginBottom: '-20px' }}/>
                    <b style={{ fontSize: '25px' }}>Catatan</b>
                  </span>
                  <div style={{ marginTop: '25px', fontSize: '18px' }}><b>Berikut adalah data teknis berupa:</b></div>
                  <div>
                    <ol>
                      <div><li style={{fontSize: '18px' }}>Luas Daerah Layanan Kolam Polder</li></div>
                      <div><b>(2000 cm²)</b></div>
                      <div><li style={{fontSize: '18px', marginTop: '10px' }}>Volume Tampungan Kolam Polder</li></div>
                      <div><b>(40000 cm<sup>3</sup>)</b></div>
                      <div><li style={{fontSize: '18px', marginTop: '10px' }}>Kapasitas Pompa</li></div>
                      <div><b>(3 x 1,5 L/min) atau (3 x 0,000025 m<sup>3</sup>/s)</b></div>
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
            <Card sx={{ maxWidth: 1100, borderRadius: '25px', minWidth: 99.75 + "%"}}>
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
            <Card sx={{ borderRadius: '25px'}}>
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


