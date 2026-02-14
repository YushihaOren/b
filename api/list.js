const { MongoClient } = require('mongodb');

// Sử dụng biến môi trường hoặc dán trực tiếp chuỗi kết nối
const MONGODB_URI = 'mongodb+srv://thanhduykady60_db_user:zmatrixlo2026@cluster0.noqdlnn.mongodb.net/?appName=Cluster0';
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('ZMatrixDB');
    cachedDb = db;
    return db;
}

export default async function handler(req, res) {
    const { pass } = req.query;
    
    try {
        const db = await connectToDatabase();
        
        // Lấy pass từ bảng settings để so sánh
        const config = await db.collection('settings').findOne({ id: 'web_config' });
        const correctPass = config ? config.admin_password : null;

        if (!pass || pass !== correctPass) {
            return res.status(403).send('<h1 style="color:red;text-align:center;">❌ Sai mật khẩu truy cập! Hãy kiểm tra DM mới nhất của Bot.</h1>');
        }

        // Nếu đúng pass, lấy danh sách key
        const keys = await db.collection('keys').find({}).toArray();
        
        let html = `
            <style>body{font-family:sans-serif;background:#1a1a1a;color:white;padding:20px} .key-item{background:#333;margin:10px 0;padding:15px;border-radius:8px;border-left:5px solid #00ff00}</style>
            <h2>💎 Danh sách Key Hệ Thống</h2>
        `;
        
        if (keys.length === 0) html += "<p>Chưa có key nào được tạo.</p>";
        
        keys.forEach(k => {
            html += `<div class="key-item"><b>Mã:</b> ${k.code} | <b>Hạn:</b> ${k.duration}</div>`;
        });

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
    } catch (e) {
        console.error(e);
        return res.status(500).send('<h1>Lỗi kết nối Database: ' + e.message + '</h1>');
    }
}
