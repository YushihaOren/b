const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://thanhduykady60_db_user:<db_password>@cluster0.noqdlnn.mongodb.net/?appName=Cluster0";
const client = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { uid, hwid } = req.query;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (!uid || !hwid) return res.send('warn("❌ Thieu thong tin!")');

    try {
        await client.connect();
        const db = client.db('ZMatrixDB');
        const users = db.collection('users');

        const user = await users.findOne({ uid: uid });

        if (!user) return res.send('warn("❌ Ban chua co Whitelist!")');

        // Tự động khóa HWID nếu máy mới
        if (!user.hwid) {
            await users.updateOne({ uid: uid }, { $set: { hwid: hwid } });
            return res.send(`print("✅ Da khoa HWID moi!")\n${getMainScript()}`);
        }

        if (user.hwid === hwid) {
            return res.send(getMainScript());
        } else {
            return res.send('warn("❌ Sai HWID!")');
        }
    } catch (e) {
        res.send('warn("❌ Loi Database: ' + e.message + '")');
    }
}

function getMainScript() {
    return `print("🚀 Script Z-Matrix Loaded!")`;
}
