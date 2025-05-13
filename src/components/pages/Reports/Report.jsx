import React from 'react'
import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography';

// Component
import Navbar from '../../Navbar';
import Sidenav from '../../Sidenav'
import './Data/DataList'
import DataList from './Data/DataList';
import '../../PumpButton'
import '../../SliderDoor'
import '../../CSS/report.css'



export default function Kolam() {
  return (
    <>
      <Navbar/>  
      <Box sx={{ display: 'flex' }} className="bg">
      <Sidenav />
      <Box sx={{ flexGrow: 1, p: 3 }} marginLeft={2}>
        <Box height={50} />
          <h1>Report Data Lingkungan Polder</h1>
          <DataList />
        </Box>
      </Box>
    </>
  )
}