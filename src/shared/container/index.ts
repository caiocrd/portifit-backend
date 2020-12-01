/* eslint-disable @typescript-eslint/no-unsafe-call */
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/users/repositories/IUserRepositorie';
import { container } from 'tsyringe';
import '@modules/users/providers/HashProvider';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepositorie';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import mailConfig from '@config/mail.config';
import IEmailProvider from './providers/EmailProvider/models/IEmailProvider';

import IMailTempleteProvider from './providers/MailTemplateProvider/models/IMailTemplatelProvider';
import HandleBarsMailTemplateProvider from './providers/MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';
import EtherealEmailProvider from './providers/EmailProvider/implementations/EtherealMailProvider';
import AmazonSesEmailProvider from './providers/EmailProvider/implementations/AmazonSesMailProvider';
import './providers/StorageProvider';

container.registerSingleton<IUserRepository>('UsersRepository', UsersRepository);

container.registerSingleton<IUserTokenRepository>('UserTokensRepository', UserTokensRepository);

container.registerSingleton<IMailTempleteProvider>('MailTemplateProvider', HandleBarsMailTemplateProvider);

container.registerInstance<IEmailProvider>(
  'EtherealEmailProvider',
  mailConfig.provider === 'ses'
    ? new AmazonSesEmailProvider(container.resolve('MailTemplateProvider'))
    : new EtherealEmailProvider(container.resolve('MailTemplateProvider')),
);
