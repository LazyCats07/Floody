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
import { useEffect } from 'react';


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
              <Card sx={{ height: '90vh', width: '100%', borderRadius: '25px' }}>
                <CardContent>
                  <span>
                    <img src={notes} alt="icon" style={{ width: '65px', marginRight: '10px', marginLeft: '10px', marginBottom: '-20px' }}/>
                    <b style={{ fontSize: '25px' }}>Catatan</b>
                  </span>
                  <div style={{ marginTop: '10px' }}>Data teknis berupa:</div>
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


