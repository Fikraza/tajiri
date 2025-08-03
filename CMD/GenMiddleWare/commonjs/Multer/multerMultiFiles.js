const multer = require("multer");
const process = require("process");

const path = require("path");

const fs = require("fs");

const multerDirPath = () => {
  const rootDir = process.cwd();

  let multerPath = path.join(rootDir, "Temp/Multer");

  return multerPath;
};

// Define Multer storage
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const relax_path = multerDirPath();
      cb(null, relax_path);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname); // Get file extension
    const fileName = "relax-save-" + Date.now() + fileExt;
    cb(null, fileName);
  },
});

// Initialize Multer (accepts any field but only processes files)
const upload = multer({ storage }).any();

async function MulterMultiFiles(req, res, next) {
  try {
    upload(req, res, function (err) {
      if (err) {
        return next(err);
      }

      // Filter out text fields, keeping only file-related keys
      if (!req.files || req.files.length === 0) {
        req.allfiles = null;
      } else {
        req.allfiles = req.files.reduce((acc, file) => {
          acc[file.fieldname] = file.filename; // Store only files
          return acc;
        }, {});
      }

      next();
    });
  } catch (e) {
    next(e);
  }
}

module.exports = MulterMultiFiles;
