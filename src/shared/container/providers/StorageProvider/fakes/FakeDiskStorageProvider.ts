/* eslint-disable @typescript-eslint/require-await */
import IStorageProvider from '../models/IStorageProvider';

export default class FakeDiskStorageProvider implements IStorageProvider {
  avatars: string[] = [];

  async saveFile(file: string): Promise<string> {
    this.avatars.push(file);
    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const avatarIndex = this.avatars.findIndex(av => av === file);
    this.avatars.splice(avatarIndex, 1);
  }
}
