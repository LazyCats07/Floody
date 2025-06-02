import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { database } from './firebase-config';
import { ref, onValue, off } from 'firebase/database';

const ApexLineChartKolam = () => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([
    { name: 'TMA Cipalasari', data: [] },
    { name: 'TMA Citarum', data: [] },
    { name: 'TMA Kolam', data: [] },
  ]);
  const [viewMode, setViewMode] = useState('perDetik');
  const [isPaused, setIsPaused] = useState(false);

  // Fungsi umum untuk update chart
  const updateChartData = (cipalasariData, citarumData, kolamData, keys) => {
    const labelsArr = [];
    const cipalasariArr = [];
    const citarumArr = [];
    const kolamArr = [];

    keys.forEach(key => {
      const labelFormatted = key.replace(/_/g, ':').replace('T', ' ').replace('Z', '');
      labelsArr.push(labelFormatted);
      cipalasariArr.push(cipalasariData?.[key] ?? null);
      citarumArr.push(citarumData?.[key] ?? null);
      kolamArr.push(kolamData?.[key] ?? null);
    });

    setLabels(labelsArr);
    setSeries([
      { name: 'TMA Cipalasari', data: cipalasariArr },
      { name: 'TMA Citarum', data: citarumArr },
      { name: 'TMA Kolam', data: kolamArr },
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
      avgGrouped[k] = arr.reduce((a, b) => a + b, 0) / arr.length;
    });

    return avgGrouped;
  };

  // Fungsi utama fetch data sesuai viewMode
  const fetchData = () => {
    const refCipalasari = ref(database, "Polder/TMA_Cipalasari");
    const refCitarum = ref(database, "Polder/TMA_Citarum");
    const refKolam = ref(database, "Polder/TMA_Kolam");

    let cipalasariData = {};
    let citarumData = {};
    let kolamData = {};

    const processAndUpdate = () => {
      if (isPaused) return;
      if (!cipalasariData || !citarumData || !kolamData) return;

      const allKeys = new Set([
        ...Object.keys(cipalasariData),
        ...Object.keys(citarumData),
        ...Object.keys(kolamData),
      ]);

      let labelsToUse = [];
      let cipalasariToUse = {};
      let citarumToUse = {};
      let kolamToUse = {};

      switch (viewMode) {
        case 'perDetik':
          labelsToUse = Array.from(allKeys).sort((a, b) => b.localeCompare(a)).slice(0, 60).reverse();
          updateChartData(cipalasariData, citarumData, kolamData, labelsToUse);
          break;
        case 'perJam':
          cipalasariToUse = groupAndAverage(cipalasariData, 'hour');
          citarumToUse = groupAndAverage(citarumData, 'hour');
          kolamToUse = groupAndAverage(kolamData, 'hour');
          labelsToUse = Object.keys({ ...cipalasariToUse, ...citarumToUse, ...kolamToUse }).sort().slice(-24);
          updateChartData(cipalasariToUse, citarumToUse, kolamToUse, labelsToUse);
          break;
        case 'perMinggu':
          cipalasariToUse = groupAndAverage(cipalasariData, 'day');
          citarumToUse = groupAndAverage(citarumData, 'day');
          kolamToUse = groupAndAverage(kolamData, 'day');
          labelsToUse = Object.keys({ ...cipalasariToUse, ...citarumToUse, ...kolamToUse }).sort().slice(-7);
          updateChartData(cipalasariToUse, citarumToUse, kolamToUse, labelsToUse);
          break;
        case 'perBulan':
          cipalasariToUse = groupAndAverage(cipalasariData, 'day');
          citarumToUse = groupAndAverage(citarumData, 'day');
          kolamToUse = groupAndAverage(kolamData, 'day');
          labelsToUse = Object.keys({ ...cipalasariToUse, ...citarumToUse, ...kolamToUse }).sort().slice(-31);
          updateChartData(cipalasariToUse, citarumToUse, kolamToUse, labelsToUse);
          break;
        case 'perTahun':
          cipalasariToUse = groupAndAverage(cipalasariData, 'month');
          citarumToUse = groupAndAverage(citarumData, 'month');
          kolamToUse = groupAndAverage(kolamData, 'month');
          labelsToUse = Object.keys({ ...cipalasariToUse, ...citarumToUse, ...kolamToUse }).sort().slice(-12);
          updateChartData(cipalasariToUse, citarumToUse, kolamToUse, labelsToUse);
          break;
        default:
          break;
      }
    };

    const unsubscribeCipalasari = onValue(refCipalasari, snapshot => {
      cipalasariData = snapshot.val() || {};
      processAndUpdate();
    });

    const unsubscribeCitarum = onValue(refCitarum, snapshot => {
      citarumData = snapshot.val() || {};
      processAndUpdate();
    });

    const unsubscribeKolam = onValue(refKolam, snapshot => {
      kolamData = snapshot.val() || {};
      processAndUpdate();
    });

    return () => {
      off(refCipalasari);
      off(refCitarum);
      off(refKolam);
    };
  };

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      if (cleanup) cleanup();
    };
  }, [viewMode, isPaused]);

  const chartOptions = {
    chart: {
      id: 'line-chart-TMA',
      type: 'line',
      height: 1000,
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
        enabled: true,
      },
      margin: {
        bottom: 60,
      },
    },
    xaxis: {
      categories: labels,
      title: {
        text: 'Tanggal & Jam',
        offsetY: 0,
        style: {
          fontSize: '15px',
          fontWeight: 'bold',
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: true,
        trim: true,
      },
      tickAmount: Math.min(labels.length, 15),
    },
    yaxis: {
      title: {
        text: 'Tinggi Air (m)',
      },
      forceNiceScale: true,
      min: 0,
      tickAmount: 10,
      labels: {
        formatter: (value) => Math.round(value),
      },
    },
    stroke: {
      curve: 'smooth',
      width: 7.5,
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
      <h5> 📍 Dayeuhkolot, Kabupaten Bandung, Jawa Barat</h5>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          style={{
            height: 40,
            minWidth: 150,
            padding: '0 18px',
            fontSize: 16,
            borderRadius: 6,
            border: `2px solid ${isPaused ? '#4caf50' : '#f44336'}`,
            backgroundColor: '#fff',
            color: isPaused ? '#4caf50' : '#f44336',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            userSelect: 'none',
            boxSizing: 'border-box',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isPaused ? '#4caf50' : '#f44336';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = isPaused ? '#4caf50' : '#f44336';
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeaveCapture={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPaused ? '▶️ Resume Update' : '⏸️ Pause Update'}
        </button>

        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          style={{
            height: 40,
            minWidth: 150,
            padding: '0 12px',
            fontSize: 16,
            borderRadius: 6,
            border: '1.5px solid #888',
            backgroundColor: '#fff',
            cursor: 'pointer',
            boxSizing: 'border-box',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3f51b5')}
          onBlur={(e) => (e.target.style.borderColor = '#888')}
        >
          <option value="perDetik">Per Detik</option>
          <option value="perJam">Per Jam</option>
          <option value="perMinggu">Per Minggu</option>
          <option value="perBulan">Per Bulan</option>
          <option value="perTahun">Per Tahun</option>
        </select>
      </div>

      <Chart options={chartOptions} series={series} type="line" height={420} />
    </div>
  );
};

export default ApexLineChartKolam;
