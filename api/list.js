const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://thanhduykady60_db_user:zmatrixlo2026@cluster0.noqdlnn.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { pass } = req.query;
    try {
        await client.connect();
        const db = client.db('ZMatrixDB');
        const config = await db.collection('settings').findOne({ id: 'web_config' });
        
        // So sánh mật khẩu từ URL với mật khẩu trong Database
        if (!pass || pass !== config.admin_password) {
            return res.status(403).send('<h1>❌ Sai mật khẩu truy cập!</h1>');
        }

        const keys = await db.collection('keys').find({}).toArray();
        let html = "<h2>Danh sách Key:</h2><ul>";
        keys.forEach(k => { html += `<li>Code: ${k.code} | Hạn: ${k.duration}</li>`; });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(html + "</ul>");
    } catch (e) {
        res.status(500).send('Lỗi kết nối DB: ' + e.message);
    } finally {
        await client.close();
    }
}
