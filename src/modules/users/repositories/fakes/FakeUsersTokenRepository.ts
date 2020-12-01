/* eslint-disable @typescript-eslint/require-await */
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { uuid } from 'uuidv4';

import IUserTokenRepository from '../IUserTokenRepositorie';

class FakeUsersTokenRepository implements IUserTokenRepository {
  userTokens: UserToken[] = [];

  async find(token: string): Promise<UserToken | undefined> {
    return this.userTokens.find(userToken => userToken.token === token);
  }

  async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      user_id,
      token: uuid(),
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.userTokens.push(userToken);
    return userToken;
  }
}

export default FakeUsersTokenRepository;
