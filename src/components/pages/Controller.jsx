import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import "../CSS/Dash.css"
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WavesIcon from '@mui/icons-material/Waves';
import HeightIcon from '@mui/icons-material/Height';
import FloodIcon from '@mui/icons-material/Flood';
import CountUp from 'react-countup';
import { useCountUp }  from 'react-countup'; 
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


// Component
import Navbar from '../Navbar';
import Sidenav from '../Sidenav'
// import '../PumpButton'
// import '../SliderDoor'
import SliderDoor from '../SliderDoor';
import PumpButton from '../PumpButton';





export default function Controller() {
return (
    <>
    <Navbar />
    <Box height={50} />
    <Box sx={{ display: 'flex' }}>
    <Sidenav />
      <Box component ="main" sx={{ flexGrow: 1, p: 3 }} marginLeft={2}>
        <h1>Kontrol</h1>

        <Grid container spacing={2}>
            <Grid size={8}>
              <Stack spacing={2} direction={'row'}>

              <Card sx={{ height: 60 + "vh", minWidth: 99.75 + "%" }}>
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
              <Card sx={{ height: 60 + "vh" }}>
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
          {/* Kontrol Pintu Air */}
          <Grid size={8}>
            <Card sx={{ height: 50 + "vh", maxWidth: 1100}}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
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
            <Card sx={{ height:  50 + "vh" }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
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
    </>
  )
}


