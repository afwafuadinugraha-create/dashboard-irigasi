const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Dummy / In-Memory Data (Update Juni/Juli 2026)
const mockData = {
  summary: {
    engine: { total: 586, normal: 524, service: 25, scrap: 36 },
    irrigator: { total: 370, normal: 357, service: 6, scrap: 7 },
    pipa: { totalMeter: 81618, hdpe: 49384, peRoll: 22417, galvanis: 9817 },
    pompa: { total: 731, aktif: 695, reKondisi: 33, scrap: 3 }
  },
  pgDistribusi: {
    labels: ['PG1', 'PG2', 'PG3', 'PG4'],
    engine: [175, 143, 181, 87],
    irrigator: [95, 121, 121, 33],
    pompa: [143, 131, 253, 204]
  },
  pipa: [
    { PG: 'PG1', Gudang: 'Lakop', Jenis_Pipa: 'Galvanis', Sub_Total: 1178, Good: 1178, Reject: 223 },
    { PG: 'PG1', Gudang: 'Lakop', Jenis_Pipa: 'HDPE', Sub_Total: 2849, Good: 2849, Reject: 12 },
    { PG: 'PG1', Gudang: 'Lakop', Jenis_Pipa: 'PE Roll Eks. Irrigator', Sub_Total: 2551, Good: 2551, Reject: 0 },
    { PG: 'PG1', Gudang: 'Kijung', Jenis_Pipa: 'Galvanis', Sub_Total: 1152, Good: 1152, Reject: 340 },
    { PG: 'PG1', Gudang: 'Kijung', Jenis_Pipa: 'HDPE', Sub_Total: 3327, Good: 3327, Reject: 0 },
    { PG: 'PG2', Gudang: 'Central PG2', Jenis_Pipa: 'HDPE', Sub_Total: 4340, Good: 4340, Reject: 100 },
    { PG: 'PG3', Gudang: 'Divisi 5', Jenis_Pipa: 'HDPE', Sub_Total: 10775, Good: 10775, Reject: 30 },
    { PG: 'PG4', Gudang: 'Kantor Project Nanas', Jenis_Pipa: 'HDPE', Sub_Total: 6878, Good: 6878, Reject: 0 }
  ],
  pompa: [
    { PG: 'PG1', Gudang: 'Lakop', Jenis_Pompa: 'Deep Well', Spec_Pompa: 'Goulds Pump', Grand_Total: 1, Aktif: 1, Re_Kondisi: 0, Scrap: 0 },
    { PG: 'PG1', Gudang: 'Lakop', Jenis_Pompa: 'Reservoir', Spec_Pompa: 'EbaraPump150x100FSKA', Grand_Total: 4, Aktif: 4, Re_Kondisi: 0, Scrap: 0 },
    { PG: 'PG1', Gudang: 'Kijung', Jenis_Pompa: 'Reservoir', Spec_Pompa: 'EbaraPump150x100FS4KA', Grand_Total: 19, Aktif: 13, Re_Kondisi: 6, Scrap: 0 },
    { PG: 'PG2', Gudang: 'Central PG2', Jenis_Pompa: 'Deep Well', Spec_Pompa: 'IDP (Ingersoll Dresser Pump)', Grand_Total: 16, Aktif: 16, Re_Kondisi: 0, Scrap: 0 },
    { PG: 'PG3', Gudang: 'Divisi 5', Jenis_Pompa: 'Reservoir', Spec_Pompa: 'EbaraPump125x100FS4LA', Grand_Total: 152, Aktif: 151, Re_Kondisi: 1, Scrap: 2 },
    { PG: 'PG4', Gudang: 'Landasan', Jenis_Pompa: 'Deep Well', Spec_Pompa: 'Flowserve Pump', Grand_Total: 60, Aktif: 51, Re_Kondisi: 9, Scrap: 0 }
  ]
};

// REST API Endpoints
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date(),
    data: mockData
  });
});

app.get('/api/assets/:category', (req, res) => {
  const { category } = req.params;
  const pgFilter = req.query.pg;

  if (!mockData[category]) {
    return res.status(404).json({ status: 'error', message: 'Kategori tidak ditemukan' });
  }

  let results = mockData[category];
  if (pgFilter && pgFilter !== 'ALL') {
    results = results.filter(item => item.PG === pgFilter);
  }

  res.json({ status: 'success', category, count: results.length, data: results });
});

// Serve Frontend SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
