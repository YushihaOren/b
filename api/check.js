const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { uid, hwid } = req.query;
    if (!uid || !hwid) return res.send('Missing Parameters');

    // Đọc database (Lưu ý: Trên Vercel file này chỉ đọc được, không ghi được vĩnh viễn)
    const dbPath = path.join(process.cwd(), 'database.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = db[uid];

    if (!user) return res.send('No Whitelist');

    // Kiểm tra HWID
    if (!user.hwid || user.hwid === hwid) {
        return res.send('Whitelisted');
    } else {
        return res.send('HWID Mismatch');
    }
}
