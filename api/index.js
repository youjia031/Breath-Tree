let records = [];

export default function handler(req, res) {
    console.log('📝 收到請求:', req.method, req.url);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ============================================
    //  POST /api/blow - 儲存吹氣記錄
    // ============================================
    if (req.method === 'POST' && req.url === '/api/blow') {
        const { blowValue, isTreeGrow } = req.body;

        const record = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
            time: new Date().toISOString(),
            blow: blowValue || 0,
            grow: isTreeGrow || false
        };

        records.push(record);
        console.log('💨 記錄:', records.length, '筆');

        return res.status(200).json({
            success: true,
            total: records.length
        });
    }

    // ============================================
    //  GET /api/stats - 統計
    // ============================================
    if (req.method === 'GET' && req.url === '/api/stats') {
        return res.status(200).json({
            total: records.length,
            grows: records.filter(r => r.grow).length
        });
    }

    // ============================================
    //  GET /api/export/csv - 匯出 CSV
    // ============================================
    if (req.method === 'GET' && req.url === '/api/export/csv') {
        if (records.length === 0) {
            return res.status(404).json({ error: '沒有資料' });
        }

        let csv = 'ID,時間,氣流強度,是否長大\n';
        records.forEach(r => {
            csv += `${r.id},${r.time},${r.blow},${r.grow ? '是' : '否'}\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=breath-tree-${Date.now()}.csv`);
        return res.status(200).send(csv);
    }

    // ============================================
    //  GET /api/export/json - 匯出 JSON
    // ============================================
    if (req.method === 'GET' && req.url === '/api/export/json') {
        if (records.length === 0) {
            return res.status(404).json({ error: '沒有資料' });
        }

        return res.status(200).json({
            records: records,
            total: records.length,
            exported: new Date().toISOString()
        });
    }

    // ============================================
    //  GET /api/diagnose - 診斷
    // ============================================
    if (req.method === 'GET' && req.url === '/api/diagnose') {
        return res.status(200).json({
            total: records.length,
            sample: records.slice(0, 3)
        });
    }

    // ============================================
    //  GET /api - 健康檢查
    // ============================================
    if (req.method === 'GET' && req.url === '/api') {
        return res.status(200).json({
            status: 'ok',
            totalRecords: records.length,
            timestamp: new Date().toISOString()
        });
    }

    return res.status(404).json({ error: '找不到路由' });
}
