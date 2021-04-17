import multer from 'multer';
import path from 'path';

const avatars = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'storage/avatars');
  },
  filename(req, file, cb) {
    const filename = Date.now() + path.extname(file.originalname);

    cb(null, filename);
  },
});

export default multer({ storage: avatars });
