import { getRepository, Repository } from 'typeorm';
import IUserTokenRepository from '../../../repositories/IUserTokenRepositorie';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokenRepository {
  ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id });
    await this.ormRepository.save(userToken);
    return userToken;
  }

  find(token: string): Promise<UserToken | undefined> {
    return this.ormRepository.findOne({ where: { token } });
  }
}

export default UserTokensRepository;
