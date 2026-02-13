const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://thanhduykady60_db_user:<db_password>@cluster0.noqdlnn.mongodb.net/?appName=Cluster0";
const client = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { pass } = req.query;
    if (pass !== 'khoideptraihahahehehihi') return res.status(403).send('Sai pass');

    try {
        await client.connect();
        const db = client.db('ZMatrixDB');
        const keys = await db.collection('keys').find({}).toArray();

        let html = "<h2>Keys chưa sử dụng (MongoDB):</h2><ul>";
        keys.forEach(k => {
            html += `<li>Mã: <b>${k.code}</b> | Hạn: <b>${k.duration}</b></li>`;
        });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html + "</ul>");
    } catch (e) {
        res.send("Lỗi kết nối: " + e.message);
    }
}
