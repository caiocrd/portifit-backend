import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname, '../..', 'temp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  directory: string;
  upload: string;
  storage: StorageEngine;
}

export default {
  driver: process.env.APP_STORAGE_DRIVER,

  directory: tempFolder,
  upload: path.join(tempFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
} as IUploadConfig;
