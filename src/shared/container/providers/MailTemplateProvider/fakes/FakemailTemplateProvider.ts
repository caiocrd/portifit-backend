/* eslint-disable @typescript-eslint/require-await */

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTempleteProvider from '../models/IMailTemplatelProvider';

export default class FakeMailTemplateProvider implements IMailTempleteProvider {
  async parse(data: IParseMailTemplateDTO): Promise<string> {
    return 'Mail template';
  }
}
