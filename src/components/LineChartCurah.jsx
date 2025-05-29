import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { database } from './firebase-config';
import { ref, onValue, off } from 'firebase/database';

const ApexLineChartCurahHujan = () => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([
    { name: 'Curah Hujan Bojongsoang', data: [] },
    { name: 'Curah Hujan Dayeuhkolot', data: [] },
  ]);
  const [viewMode, setViewMode] = useState('perJam');
  const [isPaused, setIsPaused] = useState(false);

  const updateChartData = (bojongData, dayeuhData, keys) => {
    const labelsArr = [];
    const bojongArr = [];
    const dayeuhArr = [];

    keys.forEach(key => {
      const labelFormatted = key.replace(/_/g, ':').replace('T', ' ').replace('Z', '');
      labelsArr.push(labelFormatted);
      bojongArr.push(bojongData?.[key] ?? null);
      dayeuhArr.push(dayeuhData?.[key] ?? null);
    });

    setLabels(labelsArr);
    setSeries([
      { name: 'Curah Hujan Bojongsoang', data: bojongArr },
      { name: 'Curah Hujan Dayeuhkolot', data: dayeuhArr },
    ]);
  };

  const groupAndAverage = (rawData, groupBy) => {
    const grouped = {};
    Object.entries(rawData || {}).forEach(([key, value]) => {
      let groupKey;
      if (groupBy === 'hour') groupKey = key.substring(0, 13);
      else if (groupBy === 'day') groupKey = key.substring(0, 10);
      else if (groupBy === 'month') groupKey = key.substring(0, 7);

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(value);
    });

    const avgGrouped = {};
    Object.entries(grouped).forEach(([k, arr]) => {
      avgGrouped[k] = arr.reduce((a, b) => a + b, 0) / arr.length;
    });

    return avgGrouped;
  };

  const fetchData = () => {
    const refBojong = ref(database, "Polder/bojongsoang");
    const refDayeuh = ref(database, "Polder/dayeuhkolot");

    let bojongData = {};
    let dayeuhData = {};

    const processAndUpdate = () => {
      if (isPaused) return;

      const allKeys = new Set([
        ...Object.keys(bojongData),
        ...Object.keys(dayeuhData),
      ]);

      let labelsToUse = [];
      let bojongToUse = {};
      let dayeuhToUse = {};

      switch (viewMode) {
        case 'perJam':
          bojongToUse = groupAndAverage(bojongData, 'hour');
          dayeuhToUse = groupAndAverage(dayeuhData, 'hour');
          labelsToUse = Object.keys({ ...bojongToUse, ...dayeuhToUse }).sort().slice(-24);
          updateChartData(bojongToUse, dayeuhToUse, labelsToUse);
          break;
        case 'perMinggu':
          bojongToUse = groupAndAverage(bojongData, 'day');
          dayeuhToUse = groupAndAverage(dayeuhData, 'day');
          labelsToUse = Object.keys({ ...bojongToUse, ...dayeuhToUse }).sort().slice(-7);
          updateChartData(bojongToUse, dayeuhToUse, labelsToUse);
          break;
        case 'perBulan':
          bojongToUse = groupAndAverage(bojongData, 'day');
          dayeuhToUse = groupAndAverage(dayeuhData, 'day');
          labelsToUse = Object.keys({ ...bojongToUse, ...dayeuhToUse }).sort().slice(-31);
          updateChartData(bojongToUse, dayeuhToUse, labelsToUse);
          break;
        case 'perTahun':
          bojongToUse = groupAndAverage(bojongData, 'month');
          dayeuhToUse = groupAndAverage(dayeuhData, 'month');
          labelsToUse = Object.keys({ ...bojongToUse, ...dayeuhToUse }).sort().slice(-12);
          updateChartData(bojongToUse, dayeuhToUse, labelsToUse);
          break;
        default:
          break;
      }
    };

    const unsubscribeBojong = onValue(refBojong, snapshot => {
      bojongData = snapshot.val() || {};
      processAndUpdate();
    });

    const unsubscribeDayeuh = onValue(refDayeuh, snapshot => {
      dayeuhData = snapshot.val() || {};
      processAndUpdate();
    });

    return () => {
      off(refBojong);
      off(refDayeuh);
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
      id: 'rain-chart',
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
      zoom: { enabled: true },
    },
    xaxis: {
      categories: labels,
      title: {
        text: 'Tanggal & Jam',
        style: { fontSize: '15px', fontWeight: 'bold' },
      },
      labels: { rotate: -45, rotateAlways: true },
    },
    yaxis: {
      title: { text: 'Curah Hujan (mm)' },
      min: 0,
      // max: 175,
      tickAmount: 10,
      labels: {
        formatter: val => Math.round(val),
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
      <h5>Curah Hujan Bojongsoang & Dayeuhkolot</h5>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsPaused(prev => !prev)}
          style={{
            height: '40px',
            minWidth: '150px',
            padding: '0 18px',
            fontSize: '16px',
            borderRadius: '6px',
            border: `2px solid ${isPaused ? '#4caf50' : '#f44336'}`,
            backgroundColor: '#fff',
            color: isPaused ? '#4caf50' : '#f44336',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            userSelect: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = isPaused ? '#4caf50' : '#f44336';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = isPaused ? '#4caf50' : '#f44336';
          }}
        >
          {isPaused ? '▶️ Resume Update' : '⏸️ Pause Update'}
        </button>

        <select
          value={viewMode}
          onChange={e => setViewMode(e.target.value)}
          style={{
            height: '40px',
            minWidth: '150px',
            padding: '0 12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1.5px solid #888',
            backgroundColor: '#fff',
            cursor: 'pointer',
          }}
        >
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

export default ApexLineChartCurahHujan;
