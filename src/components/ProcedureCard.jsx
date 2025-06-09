import React from 'react';
import { Box, Card, CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const ProcedureCard = ({ processImage }) => {
  return (
    <Card
      sx={{
        height: 'auto',
        width: '100%',
        borderRadius: '25px',
        overflowX: 'auto',
      }}
    >
      <CardContent>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <img src={processImage} alt="icon" style={{ width: '70px', margin: '-5 10px 10px 0' }} />
          <b style={{ fontSize: '30px', marginTop: '15px', marginLeft: '10px' }}>Prosedur Operasi Pintu Air dan Pompa</b>
        </span>

        <TableContainer sx={{ maxHeight: 440, marginTop: 1 }}>
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
                <TableCell sx={{ wordBreak: 'break-word', fontSize: '16px' }}>
                  <div><b>POMPA ON</b></div>
                  <div>Pompa 3 ON <b>+8.6 cm</b></div>
                  <div>Pompa 2 ON <b>+8.4 cm</b></div>
                  <div>Pompa 1 ON <b>+8.2 cm</b></div>
                  <div style={{ marginTop: '8px' }}><b>POMPA OFF</b></div>
                  <div>Pompa 1 OFF <b>+7.6 cm</b></div>
                  <div>Pompa 2 OFF <b>+7.2 cm</b></div>
                  <div>Pompa 3 OFF <b>+6.8 cm</b></div>
                </TableCell>
                <TableCell sx={{ wordBreak: 'break-word', fontSize: '16px' }}>
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
            <p style={{ fontSize: '18px', marginTop: '-10px', textAlign: 'justify' }}>
              Diperoleh dari berbagai sumber yang kebenarannya (data definitif) <b>Perlu</b> dipastikan atau disepakati bersama,
              <b> terutama </b> data luas daerah layanan (DTA = Daerah Tangkapan Air) dan luas kolam retensi yang sangat menentukan beban debit banjir
              dan <b>kebutuhan pompa berikut pola operasinya.</b>
            </p>
          </blockquote>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcedureCard;