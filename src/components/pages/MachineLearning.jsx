// Component
import Navbar from '../../Navbar';
import Sidenav from '../../Sidenav'
import './Data/DataList'
import DataList from './Data/DataList';
import '../../PumpButton'
import '../../SliderDoor'
import '../../CSS/report.css'
import Footer from '../../Footer';
import { useEffect, useState } from 'react';


import React from 'react'
import Box from '@mui/material/Box'


export default function Kolam() {

  useEffect(() => {
    document.title = "Floody - Report";
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar/>
      <Box sx={{ display: 'flex', flexGrow: 1 }} className="bg">
        <Sidenav />
        <Box
          sx={{
            flexGrow: 1,
    px: { xs: 1, sm: 15 },
    py: 5,  // padding lebih kecil
    marginLeft: { xs: 0, sm: -10  }, // geser ke kiri
          }}
        >
          <Box height={50} />
          <h1>Konsep </h1>
          <p style={{ color: 'white', fontWeight: 'bold', marginTop: '-20px' }}>
            {currentDateTime}
          </p>

        </Box>
      </Box>
      <Footer/>
    </Box>
  )
}
