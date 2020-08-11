import multer from "multer";
import multerConfig from "../../config/multer";

export default (req, res, next) => {
  const upload = multer(multerConfig).single("image");

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ code: "ERROR_WHEN_UPLOADING_FILE" });
    } else if (err) {
      if (err.message === "INVALID_FILE_FORMAT") {
        if (err) {
          return res.status(400).json({ code: "INVALID_FILE_FORMAT" });
        }
      }

      return res.status(400).json({ code: "ERROR_WHEN_UPLOADING_FILE" });
    }
    return next();
  });
};
