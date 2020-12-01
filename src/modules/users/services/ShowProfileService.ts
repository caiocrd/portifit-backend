/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'tsyringe';

import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepositorie';

@injectable()
class ShowProfileService {
  constructor(@inject('UsersRepository') private usersRepository: IUserRepository) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new AppError('Invalid user id');
    return user;
  }
}

export default ShowProfileService;
