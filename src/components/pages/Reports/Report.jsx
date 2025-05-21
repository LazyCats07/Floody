// import React from 'react'
// import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography';

// Component
import Navbar from '../../Navbar';
import Sidenav from '../../Sidenav'
import './Data/DataList'
import DataList from './Data/DataList';
import '../../PumpButton'
import '../../SliderDoor'
import '../../CSS/report.css'
import Footer from '../../Footer';
import { useEffect } from 'react';

// export default function Kolam() {
//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           minHeight: '100vh', // tinggi minimum 100% viewport
//         }}
//       >
//       <Navbar/>
//       <Box sx={{ display: 'flex'  }} className="bg">
//       <Sidenav />
//       <Box sx={{ flexGrow: 1, p: 3, marginLeft: -2.5}} marginLeft={2}>
//         <Box height={50} />
//           <h1>Report Data Lingkungan Polder</h1>
//           <DataList />
//         </Box>
//       </Box>
//       <Footer/>
//       </Box>
//     </>
//   )
// }

import React from 'react'
import Box from '@mui/material/Box'
// import Navbar from '../../Navbar';
// import Sidenav from '../../Sidenav'
// import DataList from './Data/DataList';
// import Footer from '../../Footer';

export default function Kolam() {

  useEffect(() => {
    document.title = "Floody - Report";
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
          <h1>Report Data Lingkungan Polder</h1>
          <DataList />
        </Box>
      </Box>
      <Footer/>
    </Box>
  )
}
