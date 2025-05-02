import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { database } from './firebase-config'; // Pastikan path sesuai dengan file firebase-config.js
import { ref, onValue } from 'firebase/database';

// Register the required chart components from Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartKolam = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const dbRef = ref(database, "Polder/TMA_Kolam"); // Path yang sesuai dengan data Anda di Realtime Database

    // Listen to the changes in the Realtime Database
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newLabels = [];
      const newData = [];

      // Ambil data terakhir yang terbaru, hanya 10 data terakhir
      const sortedData = Object.keys(data)
        .sort((a, b) => b.localeCompare(a)) // Urutkan berdasarkan key yang lebih besar (berdasarkan waktu)
        .slice(0, 10); // Ambil hanya 10 data terakhir

      // Loop through the last 10 data and format for chart
      sortedData.forEach((key) => {
        const timestamp = key;
        const value = data[key];

        // Format timestamp to a readable format (e.g., '2025-04-24 19:10:17')
        const formattedTimestamp = timestamp.replace(/_/g, ':').replace('T', ' ').replace('Z', '');

        newLabels.push(formattedTimestamp);
        newData.push(value);
      });

      // Update the state with the new data
      setLabels(newLabels.reverse()); // reverse to get the latest data first
      setData(newData.reverse());     // reverse to match the labels
    });

    // Cleanup when the component unmounts
    return () => {
      setLabels([]);
      setData([]);
    };
  }, []);

  // Chart.js data structure
  const chartData = {
    labels: labels, 
    datasets: [
      {
        label: 'Tinggi Air Kolam Polder Cipalasari 1',  // Replace this with your dataset name
        data: data,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Chart.js options with fixed Y axis range
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tanggal',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tinggi Air Kolam Polder',
        },
        min: 0,  // Rentang minimum Y-axis
        max: 11,  // Rentang maksimum Y-axis
        ticks: {
          stepSize: 1,  // Setiap langkah pada sumbu Y adalah 1
        },
      },
    },
  };

  return (
    <div>
      <h5> 2J89+MHJ, Dayeuhkolot, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40258</h5>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartKolam;
