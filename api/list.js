const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    const { pass } = req.query;
    if (pass !== 'khoideptraihahahehehihi') return res.status(403).send('Sai mật khẩu!');

    try {
        const keyPath = path.join(process.cwd(), 'key.json');
        const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        
        let html = "<h2>Danh sách Key chưa dùng:</h2><ul>";
        keys.forEach(k => {
            html += `<li>Mã: <b>${k.code}</b> | Thời hạn: <b>${k.duration}</b></li>`;
        });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html + "</ul>");
    } catch (e) {
        res.status(500).send('Lỗi đọc file key.json');
    }
}
