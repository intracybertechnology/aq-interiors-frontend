import multer from 'multer';
import path from 'path';
import fs from 'fs';

const TEMP_DIR = 'uploads/temp';
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, GIF are allowed'));
  }
};
const uploadConfig = {
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
};
export const upload = multer({ ...uploadConfig, limits: { ...uploadConfig.limits, files: 10 } });
export const uploadBlogImage = multer({ ...uploadConfig, limits: { ...uploadConfig.limits, files: 1 } });
export const uploadProjectImages = multer({ ...uploadConfig, limits: { ...uploadConfig.limits, files: 10 } });