const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://thanhduykady60_db_user:zmatrixlo2026@cluster0.noqdlnn.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { pass } = req.query;
    try {
        await client.connect();
        const db = client.db('ZMatrixDB');
        const config = await db.collection('settings').findOne({ id: 'web_config' });

        // Nếu mật khẩu trong URL không khớp với mật khẩu Bot vừa lưu trong DB
        if (!pass || pass !== config.admin_password) {
            return res.status(403).send('<h1>❌ Sai mật khẩu truy cập! Hãy xem DM mới nhất của Bot.</h1>');
        }

        const keys = await db.collection('keys').find({}).toArray();
        res.status(200).json(keys);
    } catch (e) {
        res.status(500).json({ error: e.message });
    } finally {
        await client.close();
    }
}
