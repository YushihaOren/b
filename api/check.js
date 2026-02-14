const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://thanhduykady60_db_user:<db_password>@cluster0.noqdlnn.mongodb.net/?appName=Cluster0";
const mongoClient = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { uid, hwid } = req.query;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (!uid || !hwid) return res.status(400).send('warn("❌ Thiếu UID hoặc HWID!")');

    try {
        await mongoClient.connect();
        const db = mongoClient.db('ZMatrixDB');
        const users = db.collection('users');

        const user = await users.findOne({ uid: uid });

        if (!user) return res.send('warn("❌ Bạn chưa có Whitelist!")');

        // Tự động khóa HWID nếu chưa có
        if (!user.hwid) {
            await users.updateOne({ uid: uid }, { $set: { hwid: hwid } });
            return res.send(`print("✅ Đã tự động khóa máy!")\n${getMainScript()}`);
        }

        if (user.hwid === hwid) {
            return res.send(getMainScript());
        } else {
            return res.send('warn("❌ Sai HWID! Hãy Reset trên Discord.")');
        }
    } catch (e) {
        res.send('warn("❌ Lỗi Server: ' + e.message + '")');
    }
}

function getMainScript() {
    return `print("🚀 Z-Matrix Script Loaded!")`;
}
