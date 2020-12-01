import { inject, injectable } from 'tsyringe';
import AppError from '../../../shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUserRepositorie';

interface Request {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const existEmail = await this.usersRepository.findByEmail(email);

    if (existEmail) {
      throw new AppError('Email is already been used');
    }

    const hashedPass = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({ name, email, password: hashedPass });

    const newUser = new User();
    Object.assign(newUser, user);

    return newUser;
  }
}

export default CreateUserService;
