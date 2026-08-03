// api/log.js - Vercel Serverless Function
export default async function handler(req, res) {
    // 只接受 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const logData = req.body;
        
        // 添加伺服器端時間戳
        const serverTimestamp = new Date().toISOString();
        const logEntry = {
            ...logData,
            serverTimestamp,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
        };

        // ============================================
        // 這裡的日誌會顯示在 Vercel 的 Logs 中
        // ============================================
        console.log('[BreathTree Log]', JSON.stringify(logEntry, null, 2));

        // 你也可以將日誌寫入檔案或資料庫
        // 例如：使用 Vercel KV、Supabase、或寫入檔案系統

        // 回傳成功
        res.status(200).json({
            success: true,
            message: 'Log recorded successfully',
            timestamp: serverTimestamp,
        });

    } catch (error) {
        console.error('[BreathTree Error]', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}
