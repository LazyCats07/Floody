import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { database } from './firebase-config';
import { ref, onValue, off } from 'firebase/database';

const ApexLineChartDebit = () => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([
    { name: 'Debit Cipalasari', data: [] },
    { name: 'Debit Hulu Citarum', data: [] },
    { name: 'Debit Hilir Citarum', data: [] },
  ]);
  const [viewMode, setViewMode] = useState('perDetik');
  const [isPaused, setIsPaused] = useState(false);

  const updateChartData = (cipalasariData, huluData, hilirData, keys) => {
    const labelsArr = [];
    const cipalasariArr = [];
    const huluArr = [];
    const hilirArr = [];

    keys.forEach(key => {
      const labelFormatted = key.replace(/_/g, ':').replace('T',' ').replace('Z','');
      labelsArr.push(labelFormatted);
      cipalasariArr.push(cipalasariData?.[key] ?? null);
      huluArr.push(huluData?.[key] ?? null);
      hilirArr.push(hilirData?.[key] ?? null);
    });

    setLabels(labelsArr);
    setSeries([
      { name: 'Debit Cipalasari', data: cipalasariArr },
      { name: 'Debit Hulu Citarum', data: huluArr },
      { name: 'Debit Hilir Citarum', data: hilirArr },
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
      avgGrouped[k] = arr.reduce((a,b) => a+b, 0) / arr.length;
    });

    return avgGrouped;
  };

  const fetchData = () => {
    const refCipalasari = ref(database, "Polder/Debit_Cipalasari");
    const refHulu = ref(database, "Polder/Debit_Citarum");
    const refHilir = ref(database, "Polder/Debit_Hilir");

    let cipalasariData = {};
    let huluData = {};
    let hilirData = {};

    const processAndUpdate = () => {
      if (isPaused) return;
      if (!cipalasariData || !huluData || !hilirData) return;

      const allKeys = new Set([
        ...Object.keys(cipalasariData),
        ...Object.keys(huluData),
        ...Object.keys(hilirData),
      ]);

      let labelsToUse = [];
      let cipalasariToUse = {};
      let huluToUse = {};
      let hilirToUse = {};

      switch(viewMode) {
        case 'perDetik':
          labelsToUse = Array.from(allKeys).sort((a,b) => b.localeCompare(a)).slice(0, 60).reverse();
          updateChartData(cipalasariData, huluData, hilirData, labelsToUse);
          break;
        case 'perJam':
          cipalasariToUse = groupAndAverage(cipalasariData, 'hour');
          huluToUse = groupAndAverage(huluData, 'hour');
          hilirToUse = groupAndAverage(hilirData, 'hour');
          labelsToUse = Object.keys({...cipalasariToUse, ...huluToUse, ...hilirToUse})
            .sort()
            .slice(-24);
          updateChartData(cipalasariToUse, huluToUse, hilirToUse, labelsToUse);
          break;
        case 'perMinggu':
          cipalasariToUse = groupAndAverage(cipalasariData, 'day');
          huluToUse = groupAndAverage(huluData, 'day');
          hilirToUse = groupAndAverage(hilirData, 'day');
          labelsToUse = Object.keys({...cipalasariToUse, ...huluToUse, ...hilirToUse})
            .sort()
            .slice(-7);
          updateChartData(cipalasariToUse, huluToUse, hilirToUse, labelsToUse);
          break;
        case 'perBulan':
          cipalasariToUse = groupAndAverage(cipalasariData, 'day');
          huluToUse = groupAndAverage(huluData, 'day');
          hilirToUse = groupAndAverage(hilirData, 'day');
          labelsToUse = Object.keys({...cipalasariToUse, ...huluToUse, ...hilirToUse})
            .sort()
            .slice(-31);
          updateChartData(cipalasariToUse, huluToUse, hilirToUse, labelsToUse);
          break;
        case 'perTahun':
          cipalasariToUse = groupAndAverage(cipalasariData, 'month');
          huluToUse = groupAndAverage(huluData, 'month');
          hilirToUse = groupAndAverage(hilirData, 'month');
          labelsToUse = Object.keys({...cipalasariToUse, ...huluToUse, ...hilirToUse})
            .sort()
            .slice(-12);
          updateChartData(cipalasariToUse, huluToUse, hilirToUse, labelsToUse);
          break;
        default:
          break;
      }
    };

    const unsub1 = onValue(refCipalasari, snapshot => {
      cipalasariData = snapshot.val() || {};
      processAndUpdate();
    });
    const unsub2 = onValue(refHulu, snapshot => {
      huluData = snapshot.val() || {};
      processAndUpdate();
    });
    const unsub3 = onValue(refHilir, snapshot => {
      hilirData = snapshot.val() || {};
      processAndUpdate();
    });

    return () => {
      off(refCipalasari);
      off(refHulu);
      off(refHilir);
    };
  };

  useEffect(() => {
    const cleanup = fetchData();
    return () => { if (cleanup) cleanup(); }
  }, [viewMode, isPaused]);

  const chartOptions = {
    chart: {
      id: 'line-chart-debit',
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
        enabled: true
      },
      margin: { bottom: 60 },
    },
    xaxis: {
      categories: labels,
      title: {
        text: 'Tanggal & Jam',
        offsetY: 0,
        style: { fontSize: '15px', fontWeight: 'bold' },
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
        text: 'Debit Air (L/min)',
      },
      min: 0,
      // max: 10000,
      tickAmount: 10,
      labels: {
        formatter: value => Math.round(value),
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
      <h5>📍 2J89+MHJ, Dayeuhkolot, Kabupaten Bandung, Jawa Barat</h5>

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
        height={420}
      />
    </div>
  );
};

export default ApexLineChartDebit;
