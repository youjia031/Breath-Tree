// ============================================
//  Vercel Serverless 函數寫法（和你的範本一樣）
// ============================================

// 記憶體儲存（在 Vercel 的 Serverless 環境中，請求之間會保留）
let records = [];

export default function handler(req, res) {
    // 設定 CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 處理 OPTIONS 請求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, url } = req;

    console.log(`📝 ${method} ${url}`);

    // ============================================
    //  POST /api/blow - 吹氣記錄
    // ============================================
    if (method === 'POST' && url === '/api/blow') {
        const { blowValue, isTreeGrow } = req.body;

        const record = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 3),
            time: new Date().toISOString(),
            blow: blowValue || 0,
            grow: isTreeGrow || false
        };

        records.push(record);

        console.log(`💨 記錄: ${record.blow}% ${record.grow ? '🌱長大' : ''}`);
        console.log(`📁 總共: ${records.length} 筆`);

        return res.status(200).json({
            success: true,
            total: records.length,
            record: record
        });
    }

    // ============================================
    //  GET /api/stats - 取得統計
    // ============================================
    if (method === 'GET' && url === '/api/stats') {
        const total = records.length;
        const grows = records.filter(r => r.grow).length;

        console.log(`📊 統計: ${total} 筆, ${grows} 次長大`);

        return res.status(200).json({
            total: total,
            grows: grows
        });
    }

    // ============================================
    //  GET /api/export/csv - 匯出 CSV
    // ============================================
    if (method === 'GET' && url === '/api/export/csv') {
        console.log(`📊 匯出 CSV, 共 ${records.length} 筆`);

        if (records.length === 0) {
            return res.status(404).json({
                error: '沒有資料，請先按「吹氣」'
            });
        }

        let csv = 'ID,時間,氣流強度,是否長大\n';
        records.forEach(r => {
            csv += `${r.id},${r.time},${r.blow},${r.grow ? '是' : '否'}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=breath-tree-${Date.now()}.csv`);

        return res.status(200).send(csv);
    }

    // ============================================
    //  GET /api/export/json - 匯出 JSON
    // ============================================
    if (method === 'GET' && url === '/api/export/json') {
        console.log(`📊 匯出 JSON, 共 ${records.length} 筆`);

        if (records.length === 0) {
            return res.status(404).json({
                error: '沒有資料，請先按「吹氣」'
            });
        }

        return res.status(200).json({
            records: records,
            total: records.length,
            exported: new Date().toISOString()
        });
    }

    // ============================================
    //  DELETE /api/data - 清除資料
    // ============================================
    if (method === 'DELETE' && url === '/api/data') {
        records = [];
        console.log('🗑️ 資料已清除');
        return res.status(200).json({
            success: true,
            message: '資料已清除'
        });
    }

    // ============================================
    //  GET /api/diagnose - 診斷
    // ============================================
    if (method === 'GET' && url === '/api/diagnose') {
        return res.status(200).json({
            total: records.length,
            sample: records.slice(0, 3)
        });
    }

    // ============================================
    //  GET /api - 健康檢查
    // ============================================
    if (method === 'GET' && url === '/api') {
        return res.status(200).json({
            status: 'ok',
            message: 'Breath Tree API 運作中',
            totalRecords: records.length,
            timestamp: new Date().toISOString()
        });
    }

    // ============================================
    //  找不到路由
    // ============================================
    console.log(`❌ 找不到路由: ${method} ${url}`);
    return res.status(404).json({
        error: '找不到路由',
        method: method,
        url: url
    });
}
