/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */

import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import { inject, injectable } from 'tsyringe';
import mailConfig from '@config/mail.config';
import IMailTempleteProvider from '../../MailTemplateProvider/models/IMailTemplatelProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IEmailProvider from '../models/IEmailProvider';

@injectable()
export default class AmazonSesEmailProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor(@inject('MailTemplateProvider') private mailTemplateProvider: IMailTempleteProvider) {
    this.transporter = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: 'us-west-1',
      }),
    });
  }

  async send(data: ISendMailDTO): Promise<boolean> {
    console.log('_________________AWS_____________________');
    console.log(mailConfig.default.from);

    const info = await this.transporter.sendMail({
      from: {
        name: mailConfig.default.from.name,
        address: mailConfig.default.from.email,
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
