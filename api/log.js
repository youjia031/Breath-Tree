const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 記憶體儲存（簡單測試用）
let records = [];

app.post('/api/blow', (req, res) => {
  const { blowValue, isTreeGrow } = req.body;
  
  records.push({
    id: Date.now().toString(36),
    time: new Date().toISOString(),
    blow: blowValue || 0,
    grow: isTreeGrow || false
  });
  
  console.log('💨 記錄:', records.length, '筆');
  
  res.json({
    success: true,
    total: records.length
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    total: records.length,
    grows: records.filter(r => r.grow).length
  });
});

app.get('/api/export/csv', (req, res) => {
  if (records.length === 0) {
    return res.status(404).json({ error: '沒有資料' });
  }
  
  let csv = 'ID,時間,氣流強度,是否長大\n';
  records.forEach(r => {
    csv += `${r.id},${r.time},${r.blow},${r.grow ? '是' : '否'}\n`;
  });
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=breath-tree-${Date.now()}.csv`);
  res.send(csv);
});

app.get('/api/export/json', (req, res) => {
  if (records.length === 0) {
    return res.status(404).json({ error: '沒有資料' });
  }
  res.json({
    records: records,
    total: records.length,
    exported: new Date().toISOString()
  });
});

app.get('/api/diagnose', (req, res) => {
  res.json({
    total: records.length,
    sample: records.slice(0, 3)
  });
});

const PORT = process.env.PORT || 3000;
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 伺服器啟動在 http://localhost:' + PORT);
  });
}
