/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'tsyringe';

import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepositorie';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('Invalid User Id', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }
    user.avatar = await this.storageProvider.saveFile(avatarFilename);
    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
