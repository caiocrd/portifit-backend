/* eslint-disable @typescript-eslint/require-await */
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IUserRepository from '../IUserRepositorie';

class FakeUsersRepository implements IUserRepository {
  users: User[] = [];

  async listProviders(except_user_id: string): Promise<User[]> {
    let { users } = this;
    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.email === email);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === id);
    return user;
  }

  async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users[userIndex] = user;
    return user;
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid(), name, email, password });
    this.users.push(user);
    return user;
  }
}

export default FakeUsersRepository;
