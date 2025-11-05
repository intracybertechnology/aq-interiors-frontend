import multer from 'multer';
import path from 'path';
import fs from 'fs';

const BLOG_UPLOAD_DIR = path.join(__dirname, '../../uploads/blogs');
const PROJECT_UPLOAD_DIR = path.join(__dirname, '../../uploads/projects');
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|gif|webp/;
const MAX_FILE_SIZE_BLOG = 10 * 1024 * 1024;
const MAX_FILE_SIZE_PROJECT = 10 * 1024 * 1024;

// Create upload directories
const createUploadDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

createUploadDir(BLOG_UPLOAD_DIR);
createUploadDir(PROJECT_UPLOAD_DIR);

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase());
  const mime = ALLOWED_EXTENSIONS.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const createStorage = (uploadDir: string, prefix: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    }
  });
};

export const uploadBlogImage = multer({
  storage: createStorage(BLOG_UPLOAD_DIR, 'blog'),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BLOG }
});

export const uploadProjectImage = multer({
  storage: createStorage(PROJECT_UPLOAD_DIR, 'project'),
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_PROJECT }
});

export const uploadMiddleware = uploadBlogImage;

export const getImageUrlPath = (filePath: string): string => {
  const normalized = filePath.replace(/\\/g, '/');
  const uploadIndex = normalized.indexOf('uploads/');
  
  if (uploadIndex !== -1) {
    return '/' + normalized.substring(uploadIndex);
  }
  
  const filename = path.basename(filePath);
  
  if (filename.startsWith('blog-')) {
    return `/uploads/blogs/${filename}`;
  }
  if (filename.startsWith('project-')) {
    return `/uploads/projects/${filename}`;
  }
  
  return `/uploads/${filename}`;
};