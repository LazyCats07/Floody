import React from 'react';
import Button from "@mui/material/Button";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import autoTable plugin

const GeneratePdfButton = ({ rows }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Laporan Tinggi Air Polder', 20, 20);
    doc.setFontSize(12);
    doc.text('Data lingkungan polder terrekam:', 20, 30);

    // Prepare the table data
    const tableData = rows.map((row) => [
      row.timestamp,
      row.curahHujan,
      row.debitHulu,
      row.debitHilir,
      row.debitCipalasari,
      row.tmaCipalasari,
      row.tmaKolam,
      row.tmaHilir,
      row.statusPompa,
    ]);

    // Using autoTable plugin to add the table to the PDF
    doc.autoTable({
      startY: 40,
      head: [
        [
          'Waktu', 'Curah Hujan (mm)', 'Debit Cipalasari (L/min)', 
          'Debit Citarum (L/min)', 'Debit Hilir (L/min)', 
          'TMA Kolam Polder (m)', 'TMA Sungai Citarum (m)', 
          'TMA Hilir (m)', 'Status Pompa'
        ]
      ],
      body: tableData,
    });

    // Save the generated PDF
    doc.save('laporan_tinggi_air_polder.pdf');
  };

  return (
    <Button variant="contained" color="primary" onClick={generatePDF} sx={{ margin: "10px" }}>
      Generate Laporan PDF
    </Button>
  );
};

export default GeneratePdfButton; // This is necessary for proper import
