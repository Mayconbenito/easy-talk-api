import cloudinary from "cloudinary";
import cloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";
import crypto from "crypto";

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "images",
  allowedFormats: ["jpg, png"],
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);

      const fileName = hash.toString("hex");
      cb(null, fileName);
    });
  },
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/pjpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("INVALID_FILE_FORMAT"));
    }
  },
});

export default parser;
