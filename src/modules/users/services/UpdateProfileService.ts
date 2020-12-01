/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepositorie';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, old_password, new_password }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Invalid User Id');
    }
    if (email !== user.email && (await this.usersRepository.findByEmail(email))) {
      throw new AppError('This email already exists');
    }
    if (new_password && old_password) {
      if (!(await this.hashProvider.compareHash(old_password, user.password || ''))) {
        throw new AppError('Invalid password');
      }
      user.password = await this.hashProvider.generateHash(new_password);
    }
    user.email = email;
    user.name = name;
    this.usersRepository.save(user);
    return user;
  }
}

export default UpdateProfileService;
