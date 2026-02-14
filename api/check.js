const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://thanhduykady60_db_user:zmatrixlo2026@cluster0.noqdlnn.mongodb.net/?appName=Cluster0';
const client = new MongoClient(MONGODB_URI);

export default async function handler(req, res) {
    const { uid, hwid } = req.query;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (!uid || !hwid) return res.status(200).send('warn("❌ Thieu tham so UID/HWID!")');

    try {
        await client.connect();
        const db = client.db('ZMatrixDB');
        const user = await db.collection('users').findOne({ uid: uid });

        if (!user) return res.status(200).send('warn("❌ Ban chua co Whitelist!")');

        if (!user.hwid || user.hwid === hwid) {
            if (!user.hwid) await db.collection('users').updateOne({ uid: uid }, { $set: { hwid: hwid } });
            
            return res.status(200).send(`
                print("✅ [Z-Matrix] Chao mung ${uid}!")
                -- Paste Script Lua chinh cua ban vao day
                local hint = Instance.new("Hint", game.Workspace)
                hint.Text = "Z-Matrix Loaded!"
                task.wait(2)
                hint:Destroy()
            `);
        } else {
            return res.status(200).send('warn("❌ Sai mã máy (HWID)! Vui lòng Reset trên Discord.")');
        }
    } catch (e) {
        return res.status(200).send('warn("❌ Server Error: ' + e.message + '")');
    }
}
