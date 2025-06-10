const multer = require('multer');
const storage = multer.memoryStorage(); // keep image in memory
const upload = multer({ storage });


module.exports = upload;