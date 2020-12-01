/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
import fs from 'fs';
import handlebars from 'handlebars';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTempleteProvider from '../models/IMailTemplatelProvider';

export default class HandleBarsMailTemplateProvider implements IMailTempleteProvider {
  async parse(data: IParseMailTemplateDTO): Promise<string> {
    const templetaData = await fs.promises.readFile(data.file, { encoding: 'utf-8' });
    const parserTemplate = handlebars.compile(templetaData);

    return parserTemplate(data.variables);
  }
}
