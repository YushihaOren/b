const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { uid, hwid } = req.query;

    // 1. Kiểm tra tham số đầu vào
    if (!uid || !hwid) {
        return res.status(400).send('Missing Parameters');
    }

    try {
        // 2. Đọc file database.json
        // Dùng path.join để đảm bảo đường dẫn đúng trên Vercel
        const dbPath = path.join(process.cwd(), 'database.json');
        
        // Kiểm tra xem file database có tồn tại không
        if (!fs.existsSync(dbPath)) {
            return res.status(500).send('Database not found');
        }

        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const user = db[uid];

        // 3. Xử lý logic Whitelist
        if (!user) {
            return res.status(200).send('No Whitelist');
        }

        // Kiểm tra HWID (bind máy)
        if (!user.hwid) {
            // Nếu chưa có HWID, nghĩa là máy mới, cho phép Whitelisted
            // LƯU Ý: Vercel không tự lưu lại HWID này vào file được, 
            // bạn cần kết nối Database Online (như MongoDB) để làm việc này.
            return res.status(200).send('Whitelisted');
        }

        if (user.hwid === hwid) {
            return res.status(200).send('Whitelisted');
        } else {
            return res.status(200).send('HWID Mismatch');
        }

    } catch (error) {
        return res.status(500).send('Server Error: ' + error.message);
    }
}
