import React from 'react';
import '../../../CSS/prtPDF.css'

export default function PrintData({ rows }) {
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=1200');
    printWindow.document.write('<html><head><title>Kolam Polder Cipalasari 1</title>');
    
    // Add some basic styling to center the numbers and format the table
    printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 0;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #000;
          text-align: center; /* Center the text */
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    `);

    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Kolam Polder Cipalasari 1</h1>');
    printWindow.document.write('<p>Data Laporan (31 Hari Terakhir):</p>');

    // Get the current date and the date 31 days ago
    const currentDate = new Date();
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(currentDate.getDate() - 31);

    // Function to check if a timestamp is within the last 31 days
    const isWithinLast31Days = (timestamp) => {
      const formattedTimestamp = timestamp.replace(/_/g, ':').replace(/-/g, '/');
      const date = new Date(formattedTimestamp);

      // Check if the date is within the last 31 days
      return date >= thirtyOneDaysAgo && date <= currentDate;
    };

    // Filter rows to include only those within the last 31 days and per hour
    const filteredRows = rows.filter(row => {
      // Ensure the timestamp is for the full hour and is within the last 31 days
      return isWithinLast31Days(row.timestamp) && row.timestamp.includes("00_00_01") === false;
    });

    // Creating the table dynamically for all filtered rows
    let tableContent = '<table>';
    tableContent += `
      <thead>
        <tr>
          <th>Waktu</th>
          <th>Curah Hujan Bandung Bojongsoang (mm)</th>
          <th>Curah Hujan Bandung Dayeuhkolot (mm)</th>
          <th>Debit Cipalasari (L/min)</th>
          <th>Debit Hulu (L/min)</th>
          <th>Debit Hilir (L/min)</th>
          <th>TMA Sungai Cipalasari (m)</th>
          <th>TMA Kolam Polder (m)</th>
          <th>TMA Sungai Citarum (m)</th>
        </tr>
      </thead>
      <tbody>
    `;

    // Loop through the filtered rows and add to the table
    filteredRows.forEach(row => {
      tableContent += `
        <tr>
          <td>${row.timestamp}</td>
          <td>${row.curahHujanBS}</td>
          <td>${row.curahHujanDK}</td>
          <td>${row.debitCipalasari}</td>
          <td>${row.debitHulu}</td>
          <td>${row.debitHilir}</td>
          <td>${row.tmaCipalasari}</td>
          <td>${row.tmaKolam}</td>
          <td>${row.tmaCitarum}</td>
        </tr>
      `;
    });

    tableContent += '</tbody></table>';

    // Insert the table content into the document
    printWindow.document.write(tableContent);
    printWindow.document.write('</body></html>');

    // Close the document and initiate printing
    printWindow.document.close();
    printWindow.focus(); // Focus the print window to prevent "about:blank" page
    printWindow.print();
  };

  return (
    <div>
      <span style={{ marginLeft: '10px'}}>
      </span>
      <button onClick={handlePrint} className='btn-print'>Print Laporan Data PDF</button>
      <span style={{ fontSize: '12px', color: 'black', marginLeft: '10px'}}>
        *Data dalam 31 hari terakhir
      </span>
    </div>
  );
}
