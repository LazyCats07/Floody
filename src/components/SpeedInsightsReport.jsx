import React, { useState, useEffect } from 'react';

function SpeedInsight({ url, strategy = 'mobile' }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/speed-insights?url=${encodeURIComponent(url)}&strategy=${strategy}`);
        if (!res.ok) throw new Error('Failed to load Speed Insights');
        const data = await res.json();
        setReport(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [url, strategy]);

  if (loading) return <p>Loading Speed Insights...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!report) return null;

  const score = Math.round(report.lighthouseResult.categories.performance.score * 100);

  return (
    <div>
      <h3>Speed Insights for {url}</h3>
      <p>Performance Score: {score}</p>
      <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f0f0f0', padding: 10 }}>
        {JSON.stringify(report.lighthouseResult.audits, null, 2)}
      </pre>
    </div>
  );
}

export default SpeedInsight;
