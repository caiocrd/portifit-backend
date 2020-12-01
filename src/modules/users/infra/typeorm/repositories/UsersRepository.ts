import { getRepository, Repository, Not } from 'typeorm';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUserRepository from '../../../repositories/IUserRepositorie';
import User from '../entities/User';

class UsersRepository implements IUserRepository {
  ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async listProviders(except_user_id: string): Promise<User[]> {
    let users: User[];
    if (except_user_id) users = await this.ormRepository.find({ where: { id: Not(except_user_id) } });
    else users = await this.ormRepository.find();
    return users;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });
    return user;
  }

  async save(user: User): Promise<User> {
    await this.ormRepository.save(user);
    return user;
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    await this.ormRepository.save(user);
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });
    return user;
  }
}

export default UsersRepository;
