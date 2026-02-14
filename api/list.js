const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://thanhduykady60_db_user:<db_password>@cluster0.noqdlnn.mongodb.net/?appName=Cluster0";
const mongoClient = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { pass } = req.query;
    if (pass !== 'khoideptraihahahehehihi') return res.status(403).send('Sai mật khẩu!');

    try {
        await mongoClient.connect();
        const db = mongoClient.db('ZMatrixDB');
        const keys = await db.collection('keys').find({}).toArray();

        let html = "<h2>Danh sách Key chưa dùng (Tự động):</h2><ul>";
        keys.forEach(k => {
            html += `<li>Mã: <b>${k.code}</b> | Thời hạn: <b>${k.duration}</b></li>`;
        });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html + "</ul>");
    } catch (e) {
        res.status(500).send('Lỗi kết nối MongoDB: ' + e.message);
    }
}
