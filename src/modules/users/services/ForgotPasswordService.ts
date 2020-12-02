/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { inject, injectable } from 'tsyringe';
import path from 'path';
import IEmailProvider from '../../../shared/container/providers/EmailProvider/models/IEmailProvider';
import AppError from '../../../shared/errors/AppError';

import IUserRepository from '../repositories/IUserRepositorie';
import IUserTokenRepository from '../repositories/IUserTokenRepositorie';

@injectable()
class ForgotPasswordService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
    @inject('EtherealEmailProvider') private emailProvider: IEmailProvider,
    @inject('UserTokensRepository') private userTokenProvider: IUserTokenRepository,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) throw new AppError('Invalid User Email', 400);
    const { token } = await this.userTokenProvider.generate(user.id);

    const file = path.resolve(__dirname, '..', 'views', 'forgot_pass_template.hbs');

    await this.emailProvider.send({
      to: { name: user.name, email: user.email },
      subject: '[GO BARBER] Recuperação de senha',
      templateData: {
        file,
        variables: {
          name: user.name,
          link: `${process.env.URL_WEB_APP}reset-password?token=${token}`,
        },
      },
    });
  }
}

export default ForgotPasswordService;
