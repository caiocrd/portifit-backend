/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */

import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTempleteProvider from '../../MailTemplateProvider/models/IMailTemplatelProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IEmailProvider from '../models/IEmailProvider';

@injectable()
export default class EtherealEmailProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor(@inject('MailTemplateProvider') private mailTemplateProvider: IMailTempleteProvider) {
    nodemailer.createTestAccount().then(account => {
      this.transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    });
  }

  async send(data: ISendMailDTO): Promise<boolean> {
    console.log(await this.mailTemplateProvider.parse(data.templateData));

    const info = await this.transporter.sendMail({
      from: {
        name: data.from?.name || 'Equioe Go Barber',
        address: data.from?.email || 'equipe@goibabrbe.coom',
      },
      to: { name: data.to.name, address: data.to.email },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
    });
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  }
}
