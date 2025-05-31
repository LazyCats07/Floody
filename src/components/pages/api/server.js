// server.js
import express from 'express';
import speedInsights from '@vercel/speed-insights';

const app = express();
const PORT = 5000;

app.get('/api/speed-insights', async (req, res) => {
  const { url, strategy = 'mobile' } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL query parameter required' });
  }
  try {
    const report = await speedInsights(url, { strategy });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
