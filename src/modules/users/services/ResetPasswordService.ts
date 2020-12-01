/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import IUserRepository from '../repositories/IUserRepositorie';
import IUserTokenRepository from '../repositories/IUserTokenRepositorie';

interface IRequest {
  token: string;
  newPassword: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('UserTokensRepository') private userTokenRepository: IUserTokenRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, newPassword }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.find(token);
    if (!userToken) throw new AppError('Invalid Token');

    const compareDate = addHours(userToken.created_at, 2);

    if (isAfter(Date.now(), compareDate)) throw new AppError('Token expired');

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) throw new AppError('Invalid user');

    user.password = await this.hashProvider.generateHash(newPassword);
    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
