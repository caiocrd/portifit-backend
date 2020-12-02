import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import authConf from '../../../configurations/auth.conf';

import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepositorie';

interface Request {
  email: string;
  password: string;
}
@injectable()
class AuthService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect', 401);
    }
    const userPass: string = user.password ? user.password : '';
    const comparePasword = await this.hashProvider.compareHash(password, userPass);

    if (!comparePasword) throw new AppError('Email or password incorrect', 401);

    const token = sign({}, authConf.jwt.secret, {
      subject: user.id,
      expiresIn: '2d',
    });
    console.log(token);

    return { user, token };
  }
}

export default AuthService;
