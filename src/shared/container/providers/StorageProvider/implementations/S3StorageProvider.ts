import uploadConfig from '@config/upload.config';
import AppError from '@shared/errors/AppError';
import fs from 'fs';
import aws, { S3 } from 'aws-sdk';
import path from 'path';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-west-1',
    });
  }

  async saveFile(file: string): Promise<string> {
    const originalPath = path.join(uploadConfig.directory, file);
    const fileContent = await fs.promises.readFile(path.join(uploadConfig.directory, file));
    const ContentType = mime.getType(originalPath);
    if (!ContentType) throw new Error('File not found');
    await this.client
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME || '',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();
    await fs.promises.unlink(originalPath);
    return file;
  }

  async deleteFile(file: string): Promise<void> {
    try {
      await this.client.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME || '', Key: file }).promise();
    } catch (error) {
      throw new AppError('Avatar do usuario não existe');
    }
  }
}
