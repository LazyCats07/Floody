import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { database } from './firebase-config'; // Ensure the correct path to firebase-config.js
import { ref, onValue } from 'firebase/database';
import "./CSS/LineChart.css";
import Box from '@mui/material/Box';

// Register the required chart components from Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartKolam = () => {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [viewMode, setViewMode] = useState('perDetik'); // Default view mode set to 'perDetik'
  const timeoutRef = useRef(null); // Ref to store the timeout ID
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility

  // Fetch data per detik (last 10 seconds)
  const fetchDataPerDetik = () => {
    const dbRef = ref(database, "Polder/TMA_Sungai");

    onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      const newLabels = [];
      const newData = [];

      // Sort and slice data to get the last 10 data points (10 seconds)
      const sortedData = Object.keys(rawData)
        .sort((a, b) => b.localeCompare(a)) // Sort data by timestamp descending
        .slice(0, 10); // Limit to the latest 10 entries

      sortedData.forEach((key) => {
        const timestamp = key;
        const value = rawData[key];
        const formattedTimestamp = timestamp.replace(/_/g, ':').replace('T', ' ').replace('Z', '');

        newLabels.push(formattedTimestamp);
        newData.push(value);
      });

      // Set the last 10 data and labels after the delay
      setLabels(newLabels.reverse());
      setData(newData.reverse());
    });
  };

  // Fetch data per jam (group by hour and get the last value for each hour)
  const fetchDataPerJam = () => {
    const dbRef = ref(database, "Polder/TMA_Sungai");

    onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      const newLabels = [];
      const newData = [];

      const groupedData = {};

      // Process and group data by hour
      Object.keys(rawData).forEach((key) => {
        const timestamp = key;
        const value = rawData[key];
        const hour = timestamp.substring(0, 13); // Extract the hour part (YYYY-MM-DD HH)

        if (!groupedData[hour]) {
          groupedData[hour] = [];
        }
        groupedData[hour].push(value);
      });

      const sortedHours = Object.keys(groupedData).sort();

      // Limit to the last 24 hours of data
      const last24Hours = sortedHours.slice(-24);  // Only get the last 12 hours

      last24Hours.forEach((hour) => {
        const values = groupedData[hour];
        const lastValue = values[values.length - 1];
        newLabels.push(hour);
        newData.push(lastValue);
      });

      setLabels(newLabels);
      setData(newData);
    });
  };

  // Fetch data per minggu (showing the last 7 days of data)
  const fetchDataPerMinggu = () => {
    const dbRef = ref(database, "Polder/TMA_Sungai");

    onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      const newLabels = [];
      const newData = [];

      const groupedData = {};

      // Process data and group by date (YYYY-MM-DD)
      Object.keys(rawData).forEach((key) => {
        const timestamp = key;
        const value = rawData[key];
        const date = timestamp.substring(0, 10); // Take only the date part (YYYY-MM-DD)

        if (!groupedData[date]) {
          groupedData[date] = [];
        }
        groupedData[date].push(value);
      });

      const sortedDates = Object.keys(groupedData).sort().reverse(); // Sort in descending order

      // Get the last 7 days of data
      const last7Days = sortedDates.slice(0, 7);

      last7Days.forEach((date) => {
        const values = groupedData[date];
        const avgValue = values.reduce((acc, val) => acc + val, 0) / values.length; // Average value per day
        newLabels.push(date);
        newData.push(avgValue);
      });

      setLabels(newLabels.reverse());
      setData(newData.reverse());
    });
  };
  
// Fetch data per bulan (4 nodes representing 4 weeks per month)

 // Fetch data per bulan (group by month and average the values)
 const fetchDataPerBulan = () => {
  const dbRef = ref(database, "Polder/TMA_Sungai");

  onValue(dbRef, (snapshot) => {
    const rawData = snapshot.val();
    const newLabels = [];
    const newData = [];

    const groupedData = {};

    // Process data and group by date (YYYY-MM-DD)
    Object.keys(rawData).forEach((key) => {
      const timestamp = key;
      const value = rawData[key];
      const date = timestamp.substring(0, 10); // Take only the date part (YYYY-MM-DD)

      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      groupedData[date].push(value);
    });

    const sortedDates = Object.keys(groupedData).sort().reverse(); // Sort in descending order

    // Get the last 7 days of data
    const last7Days = sortedDates.slice(0, 31);

    last7Days.forEach((date) => {
      const values = groupedData[date];
      const avgValue = values.reduce((acc, val) => acc + val, 0) / values.length; // Average value per day
      newLabels.push(date);
      newData.push(avgValue);
    });

    setLabels(newLabels.reverse());
    setData(newData.reverse());
  });
};






  // Fetch data per tahun (group by year and average the values)
  const fetchDataPerTahun = () => {
    const dbRef = ref(database, "Polder/TMA_Sungai");
    
    onValue(dbRef, (snapshot) => {
      const rawData = snapshot.val();
      const newLabels = [];
      const newData = [];
  
      const groupedData = {};
  
      // Process data and group by month (YYYY-MM)
      Object.keys(rawData).forEach((key) => {
        const timestamp = key;
        const value = rawData[key];
        const month = timestamp.substring(0, 7); // Take the month part (YYYY-MM)
  
        if (!groupedData[month]) {
          groupedData[month] = [];
        }
        groupedData[month].push(value);
      });
  
      const sortedMonths = Object.keys(groupedData).sort();
  
      sortedMonths.forEach((month) => {
        const values = groupedData[month];
        const avgValue = values.reduce((acc, val) => acc + val, 0) / values.length; // Average value per month
        newLabels.push(month);
        newData.push(avgValue);
      });
  
      setLabels(newLabels);
      setData(newData);
    });
  };

  // Fetch data based on selected view mode with a delay of 3 seconds
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Clear previous timeout

    timeoutRef.current = setTimeout(() => {
      if (viewMode === 'perDetik') {
        fetchDataPerDetik();
      } else if (viewMode === 'perJam') {
        fetchDataPerJam();
      } else if (viewMode === 'perMinggu') {
        fetchDataPerMinggu();
      } else if (viewMode === 'perBulan') {
        fetchDataPerBulan();
      } else if (viewMode === 'perTahun') {
        fetchDataPerTahun();
      }
    }, 3000); // Delay fetch data by 3 seconds
  }, [viewMode]);

  // Chart.js data structure
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tinggi Air Kolam Polder Cipalasari 1 (m)',
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
          text: 'Tanggal & Jam',
        },
        ticks: {
          maxRotation: 90,
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tinggi Air Kolam Polder',
        },
        min: 0,
        max: 11,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div>
      <h5>2J89+MHJ, Dayeuhkolot, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40258</h5>
      <div>
        {/* Dropdown button to toggle between per detik, per jam, per minggu, per bulan, and per tahun */}
        <button onClick={toggleDropdown}>View Mode</button>
        {dropdownOpen && (
          <div className="dropdown-content">
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="perDetik" 
                checked={viewMode === 'perDetik'} 
                onChange={() => setViewMode('perDetik')} 
              />
              Per Detik
            </label>
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="perJam" 
                checked={viewMode === 'perJam'} 
                onChange={() => setViewMode('perJam')} 
              />
              Per Jam
            </label>
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="perMinggu" 
                checked={viewMode === 'perMinggu'} 
                onChange={() => setViewMode('perMinggu')} 
              />
              Per Minggu
            </label>
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="perBulan" 
                checked={viewMode === 'perBulan'} 
                onChange={() => setViewMode('perBulan')} 
              />
              Per Bulan
            </label>
            <label>
              <input 
                type="radio" 
                name="viewMode" 
                value="perTahun" 
                checked={viewMode === 'perTahun'} 
                onChange={() => setViewMode('perTahun')} 
              />
              Per Tahun
            </label>
          </div>
        )}
      </div>
      <Box height={20} />
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartKolam;
