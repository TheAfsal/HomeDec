const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create a temporary upload directory if it doesn't exist
const tempDir = path.join(__dirname, "../tempUploads");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id);
  },
});

// Export the configured multer instance
const saveTempProductImage = multer({ storage });

module.exports = saveTempProductImage;
