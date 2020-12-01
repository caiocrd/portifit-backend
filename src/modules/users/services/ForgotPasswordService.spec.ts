import FakeEmailProvider from '@shared/container/providers/EmailProvider/fakes/FakeEmailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import ForgotPasswordService from './ForgotPasswordService';

let userRep: FakeUsersRepository;
let mailProvider: FakeEmailProvider;
let usersTokenRep: FakeUsersTokenRepository;
let forgotPasswordService: ForgotPasswordService;

describe('ForgotPasswordService', () => {
  beforeEach(() => {
    userRep = new FakeUsersRepository();
    mailProvider = new FakeEmailProvider();
    usersTokenRep = new FakeUsersTokenRepository();
    forgotPasswordService = new ForgotPasswordService(userRep, mailProvider, usersTokenRep);
  });
  it('Should be able to recover password using email', async () => {
    const sendFunction = jest.spyOn(mailProvider, 'send');

    await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    await forgotPasswordService.execute('caio.crd@gmail.com');

    expect(sendFunction).toHaveBeenCalled();
  });
  it('Should not be able to recover password for inexistent user', async () => {
    await expect(forgotPasswordService.execute('caio.crd@gmail.com')).rejects.toBeInstanceOf(AppError);
  });
  it('Should generate a token for a password reset', async () => {
    const generateFunction = jest.spyOn(usersTokenRep, 'generate');
    const user = await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });
    await forgotPasswordService.execute('caio.crd@gmail.com');
    expect(generateFunction).toHaveBeenCalledWith(user.id);
  });
});
