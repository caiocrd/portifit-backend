import { compare, hash } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  async generateHash(payload: string): Promise<string> {
    const hashedPass = await hash(payload, 2);
    return hashedPass;
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
