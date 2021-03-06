import fs from 'fs';
import path from 'path';
import AppError from '../../../../errors/AppError';
import uploadConfig from '../../../../../configurations/upload.config';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  async saveFile(file: string): Promise<string> {
    await fs.promises.rename(path.join(uploadConfig.directory, file), path.join(uploadConfig.upload, file));
    return file;
  }

  async deleteFile(file: string): Promise<void> {
    try {
      await fs.promises.stat(path.join(uploadConfig.upload, file));
      await fs.promises.unlink(path.join(uploadConfig.upload, file));
    } catch (error) {
      throw new AppError('Avatar do usuario não existe');
    }
  }
}
