import React from 'react';
import { Box, Container, Grid, Link, Typography, Divider, IconButton } from '@mui/material';
import { BsGithub, BsInstagram, BsYoutube } from "react-icons/bs";
import { useAppStore } from '../appStore'; // pastikan pathnya benar
import Logo from './images/Log-Full-Color.png'

export default function MuiFooter() {
  const open = useAppStore((state) => state.dopen);  // ambil state open dari store

  // lebar sidebar ketika terbuka dan tertutup
  const drawerWidth = 240;
  const closedWidth = 60; // sesuai yang kamu gunakan di sidebar

  return (
    <Box
    component="footer"
    sx={{
        backgroundColor: 'background.paper',
        py: 6,
        // tidak pakai position fixed
        transition: 'margin-left 0.3s ease',
        marginLeft: open ? '240px' : '60px', // geser sesuai sidebar terbuka/tutup
    }}
    >
      <Container maxWidth="lg">
        {/* Brand + Link Groups */}
        <Grid container spacing={4} justifyContent="space-between" alignItems="flex-start">
          {/* Brand */}
          <Grid item xs={12} sm={4} md={3}>
            <Link href="/Home" underline="none" sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src={Logo}
                alt="Flooody Logo"
                sx={{ height: 40, mr: 1 }}
              />
              {/* <Typography variant="h6" color="text.primary" fontWeight="bold">
                Flowbite
              </Typography> */}
            </Link>
            <div
              style={{
                maxWidth: '500px',     // lebar maksimal
                // padding: '16px',       // ruang dalam kotak
                border: '0px solid #ccc', // garis kotak
                borderRadius: '8px',   // sudut membulat (opsional)
                boxSizing: 'border-box',  // supaya padding tidak nambah lebar
                margin: '0 auto',      // supaya center dan tidak melebihi kanan kiri
                wordWrap: 'break-word', // supaya kata panjang terbungkus rapi
                opacity: 0.75,   
              }}
            >
              <p>
                Floody adalah sistem mitigasi banjir yang dikembangkan untuk membantu masyarakat dalam menghadapi kondisi banjir yang memberikan dampak negatif.
              </p>
            </div>
          </Grid>

          {/* Link Sections */}
          <Grid item xs={12} sm={8} md={8}>
            <Grid container spacing={3} justifyContent="flex-end">
              <Grid item xs={4} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  About
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link href="https://react.dev/" underline="hover" color="text.secondary">React.js</Link>
                  <Link href="https://mui.com" underline="hover" color="text.secondary">Material UI</Link>
                  <Link href="https://apexcharts.com/" underline="hover" color="text.secondary">Apex Chart</Link>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Follow us
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link href="https://github.com/LazyCats07/Floody" underline="hover" color="text.secondary">Github</Link>
                  <Link href="https://www.instagram.com/mbclab/" underline="hover" color="text.secondary">Instagram</Link>
                  <Link href="https://youtu.be/cngZ8W3FFDM" underline="hover" color="text.secondary">Youtube</Link>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Our Developer
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Link href="https://www.linkedin.com/in/alfarelzi/" underline="hover" color="text.secondary">Alfarelzi</Link>
                  <Link href="https://www.linkedin.com/in/mrafiediananta/" underline="hover" color="text.secondary">Muhammad Rafi Ediananta</Link>
                  <Link href="https://www.linkedin.com/in/mahakiimm/" underline="hover" color="text.secondary">Muhammad Abdul Hakim</Link>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4 }} />

        {/* Copyright and Social Icons */}
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none' }}>
              © {new Date().getFullYear()} Floody™. All rights reserved.
            </Typography>
          </Grid>

          <Grid item>
            <Box>
              <IconButton component="a" href="https://www.instagram.com/mbclab/" aria-label="Instagram" color="primary">
                <BsInstagram />
              </IconButton>
              <IconButton component="a" href="https://github.com/LazyCats07/Floody" aria-label="Github" color="primary">
                <BsGithub />
              </IconButton>
              <IconButton component="a" href="https://youtu.be/cngZ8W3FFDM" aria-label="Youtube" color="primary">
                <BsYoutube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
