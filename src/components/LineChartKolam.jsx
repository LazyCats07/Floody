import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { database } from './firebase-config';
import { ref, onValue, off } from 'firebase/database';

const ApexLineChartKolam = () => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([
    { name: 'TMA Hilir', data: [] },
    { name: 'TMA Kolam', data: [] },
    { name: 'TMA Sungai', data: [] },
  ]);
  const [viewMode, setViewMode] = useState('perDetik');
  const [isPaused, setIsPaused] = useState(false); // State untuk pause/resume

  // Fungsi umum untuk update chart
  const updateChartData = (hilirData, kolamData, sungaiData, keys) => {
    const labelsArr = [];
    const hilirArr = [];
    const kolamArr = [];
    const sungaiArr = [];   

    keys.forEach(key => {
      const labelFormatted = key.replace(/_/g, ':').replace('T',' ').replace('Z','');
      labelsArr.push(labelFormatted);
      hilirArr.push(hilirData?.[key] ?? null);
      kolamArr.push(kolamData?.[key] ?? null);
      sungaiArr.push(sungaiData?.[key] ?? null);
    });

    setLabels(labelsArr);
    setSeries([
      { name: 'TMA Sungai Cipalasari', data: hilirArr },
      { name: 'TMA Kolam ', data: kolamArr },
      { name: 'TMA Sungai Citarum', data: sungaiArr },
    ]);
  };

  // Fungsi untuk mengelompokkan dan rata-rata data per jam/hari/bulan
  const groupAndAverage = (rawData, groupBy) => {
    const grouped = {};

    Object.entries(rawData || {}).forEach(([key, value]) => {
      let groupKey;
      if (groupBy === 'hour') {
        groupKey = key.substring(0, 13);
      } else if (groupBy === 'day') {
        groupKey = key.substring(0, 10);
      } else if (groupBy === 'month') {
        groupKey = key.substring(0, 7);
      }

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(value);
    });

    const avgGrouped = {};
    Object.entries(grouped).forEach(([k, arr]) => {
      avgGrouped[k] = arr.reduce((a,b) => a+b, 0) / arr.length;
    });

    return avgGrouped;
  };

  // Fungsi utama fetch data sesuai viewMode
  const fetchData = () => {
    const refHilir = ref(database, "Polder/TMA_Hilir");
    const refKolam = ref(database, "Polder/TMA_Kolam");
    const refSungai = ref(database, "Polder/TMA_Sungai");

    let hilirData = {};
    let kolamData = {};
    let sungaiData = {};

    const processAndUpdate = () => {
      if (isPaused) return; // Kalau pause, jangan update data
      if (!hilirData || !kolamData || !sungaiData) return;

      const allKeys = new Set([
        ...Object.keys(hilirData),
        ...Object.keys(kolamData),
        ...Object.keys(sungaiData),
      ]);

      let labelsToUse = [];
      let hilirToUse = {};
      let kolamToUse = {};
      let sungaiToUse = {};

      switch(viewMode) {
        case 'perDetik':
          labelsToUse = Array.from(allKeys).sort((a,b) => b.localeCompare(a)).slice(0, 15).reverse();
          updateChartData(hilirData, kolamData, sungaiData, labelsToUse);
          break;
        case 'perJam':
          hilirToUse = groupAndAverage(hilirData, 'hour');
          kolamToUse = groupAndAverage(kolamData, 'hour');
          sungaiToUse = groupAndAverage(sungaiData, 'hour');
          labelsToUse = Object.keys({...hilirToUse, ...kolamToUse, ...sungaiToUse})
            .sort()
            .slice(-24);
          updateChartData(hilirToUse, kolamToUse, sungaiToUse, labelsToUse);
          break;
        case 'perMinggu':
          hilirToUse = groupAndAverage(hilirData, 'day');
          kolamToUse = groupAndAverage(kolamData, 'day');
          sungaiToUse = groupAndAverage(sungaiData, 'day');
          labelsToUse = Object.keys({...hilirToUse, ...kolamToUse, ...sungaiToUse})
            .sort()
            .slice(-7);
          updateChartData(hilirToUse, kolamToUse, sungaiToUse, labelsToUse);
          break;
        case 'perBulan':
          hilirToUse = groupAndAverage(hilirData, 'day');
          kolamToUse = groupAndAverage(kolamData, 'day');
          sungaiToUse = groupAndAverage(sungaiData, 'day');
          labelsToUse = Object.keys({...hilirToUse, ...kolamToUse, ...sungaiToUse})
            .sort()
            .slice(-31);
          updateChartData(hilirToUse, kolamToUse, sungaiToUse, labelsToUse);
          break;
        case 'perTahun':
          hilirToUse = groupAndAverage(hilirData, 'month');
          kolamToUse = groupAndAverage(kolamData, 'month');
          sungaiToUse = groupAndAverage(sungaiData, 'month');
          labelsToUse = Object.keys({...hilirToUse, ...kolamToUse, ...sungaiToUse})
            .sort()
            .slice(-12);
          updateChartData(hilirToUse, kolamToUse, sungaiToUse, labelsToUse);
          break;
        default:
          break;
      }
    };

    const unsubscribeHilir = onValue(refHilir, snapshot => {
      hilirData = snapshot.val() || {};
      processAndUpdate();
    });

    const unsubscribeKolam = onValue(refKolam, snapshot => {
      kolamData = snapshot.val() || {};
      processAndUpdate();
    });

    const unsubscribeSungai = onValue(refSungai, snapshot => {
      sungaiData = snapshot.val() || {};
      processAndUpdate();
    });

    return () => {
      off(refHilir);
      off(refKolam);
      off(refSungai);
    };
  };

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      if (cleanup) cleanup();
    }
  }, [viewMode, isPaused]); // Tambahkan isPaused di dependency

  const chartOptions = {
    chart: {
      id: 'line-chart',
      type: 'line',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true
      },
    // margin bawah agar ada ruang untuk judul xaxis
      margin: { 
        bottom: 60 
      },
    },
    xaxis: {
      categories: labels,
      title: {
        text: 'Tanggal & Jam',
        offsetY: 0,  // menurunkan posisi tulisan supaya tidak kena sumbu x
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
    }
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: true,
        trim: true,
      }
    },
    yaxis: {
      title: {
        text: 'Tinggi Air (m)',
      },
      min: 0,
      max: 11,
      tickAmount: 11,
      labels: {
        formatter: function (value) {
          return Math.round(value);
        }
      },
    },
    stroke: {
      curve: 'smooth',
      width: 5,
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
  };

  return (
    <div>
      <h5>2J89+MHJ, Dayeuhkolot, Kec. Dayeuhkolot, Kabupaten Bandung, Jawa Barat 40258</h5>

    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
{/* Tombol Pause / Resume */}
<button
  onClick={() => setIsPaused(prev => !prev)}
  style={{
    height: '40px',
    minWidth: '150px',
    padding: '0 18px', // padding vertikal dihapus, diatur oleh height
    fontSize: '16px',
    borderRadius: '6px',
    border: `2px solid ${isPaused ? '#4caf50' : '#f44336'}`,
    // border: `0.5px solid black`,
    backgroundColor: '#fff',
    color: isPaused ? '#4caf50' : '#f44336',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    userSelect: 'none',
    boxSizing: 'border-box', // supaya padding & border masuk hitungan ukuran
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.backgroundColor = isPaused ? '#4caf50' : '#f44336';
    e.currentTarget.style.color = '#fff';
  }}
  onMouseLeave={e => {
    e.currentTarget.style.backgroundColor = '#fff';
    e.currentTarget.style.color = isPaused ? '#4caf50' : '#f44336';
  }}
  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
  onMouseLeaveCapture={e => (e.currentTarget.style.transform = 'scale(1)')}
>
  {isPaused ? '▶️ Resume Update' : '⏸️ Pause Update'}
</button>

{/* Dropdown select */}
<select
  value={viewMode}
  onChange={e => setViewMode(e.target.value)}
  style={{
    height: '40px',
    minWidth: '150px',
    padding: '0 12px', // padding vertikal dihapus, diatur oleh height
    fontSize: '16px',
    borderRadius: '6px',
    border: '1.5px solid #888',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    transition: 'border-color 0.3s ease',
  }}
  onFocus={e => (e.target.style.borderColor = '#3f51b5')}
  onBlur={e => (e.target.style.borderColor = '#888')}
>
  <option value="perDetik">Per Detik</option>
  <option value="perJam">Per Jam</option>
  <option value="perMinggu">Per Minggu</option>
  <option value="perBulan">Per Bulan</option>
  <option value="perTahun">Per Tahun</option>
</select>
</div>


      <Chart
        options={chartOptions}
        series={series}
        type="line"
        height={300}
      />
    </div>
  );
};

export default ApexLineChartKolam;
