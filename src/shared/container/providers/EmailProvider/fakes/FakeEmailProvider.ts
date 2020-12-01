/* eslint-disable @typescript-eslint/require-await */

import ISendMailDTO from '../dtos/ISendMailDTO';
import IEmailProvider from '../models/IEmailProvider';

export default class FakeEmailProvider implements IEmailProvider {
  emails: ISendMailDTO[] = [];

  async send(data: ISendMailDTO): Promise<boolean> {
    this.emails.push(data);
    return true;
  }
}
