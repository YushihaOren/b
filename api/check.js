const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { uid, hwid } = req.query;

    // Thiết lập Header để Roblox nhận diện đây là văn bản thuần (Plain Text)
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // 1. Kiểm tra tham số đầu vào
    if (!uid || !hwid) {
        return res.status(400).send('warn("❌ [Z-Matrix] Thieu tham so UID hoac HWID!")');
    }

    try {
        // 2. Đọc file database.json từ thư mục gốc
        const dbPath = path.join(process.cwd(), 'database.json');
        
        if (!fs.existsSync(dbPath)) {
            return res.status(500).send('warn("❌ [Z-Matrix] Khong tim thay file Database tren Server!")');
        }

        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const user = db[uid];

        // 3. Xử lý logic trả về Script Lua
        if (!user) {
            return res.status(200).send('warn("❌ [Z-Matrix] UserID: ' + uid + ' chua co trong he thong Whitelist!")');
        }

        // Kiểm tra HWID (Tự động chấp nhận nếu user.hwid trống - máy mới)
        if (!user.hwid || user.hwid === hwid) {
            // ĐOẠN DƯỚI ĐÂY LÀ NỘI DUNG SCRIPT LUA SẼ CHẠY TRONG GAME
            return res.status(200).send(`
                print("✅ [Z-Matrix] Xac thuc thanh cong cho User: ${uid}")
                print("🚀 Dang tai Script chinh...")
                
                -- Dán nội dung Script chính của bạn (Hack/Admin/Farm) vào dưới đây
                local message = Instance.new("Hint", game.Workspace)
                message.Text = "Z-Matrix Loaded Successfully!"
                wait(3)
                message:Destroy()
            `);
        } else {
            return res.status(200).send('warn("❌ [Z-Matrix] Sai HWID! Vui long vao Discord de Reset HWID.")');
        }

    } catch (error) {
        return res.status(500).send('warn("❌ [Z-Matrix] Server Error: ' + error.message + '")');
    }
}
