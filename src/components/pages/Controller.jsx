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


