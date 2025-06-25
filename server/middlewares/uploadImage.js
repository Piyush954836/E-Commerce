// server/middlewares/upload.js
const multer = require('multer');

const storage = multer.memoryStorage(); // ⬅️ keep files in memory

const upload = multer({ storage });

module.exports = upload;
