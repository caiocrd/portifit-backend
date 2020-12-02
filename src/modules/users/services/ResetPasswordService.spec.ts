import AppError from '../../../shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let userRep: FakeUsersRepository;
let usersTokenRep: FakeUsersTokenRepository;
let resetPasswordService: ResetPasswordService;
let hashProvider: IHashProvider;
describe('ForgotPasswordService', () => {
  beforeEach(() => {
    userRep = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    usersTokenRep = new FakeUsersTokenRepository();
    resetPasswordService = new ResetPasswordService(userRep, usersTokenRep, hashProvider);
  });
  it('Should be able to reset password using the token', async () => {
    const user = await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    const generateHashFunction = jest.spyOn(hashProvider, 'generateHash');

    const token = await usersTokenRep.generate(user.id);

    await resetPasswordService.execute({ token: token.token, newPassword: 'new-password' });

    const updatedUser = await userRep.findById(user.id);

    expect(generateHashFunction).toBeCalledWith('new-password');

    expect(updatedUser?.password).toEqual('new-password');
  });

  it('Should not be able to reset password using invalid token', async () => {
    await expect(
      resetPasswordService.execute({ token: 'INVALID TOKENS', newPassword: 'new-password' }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('Should not be able to reset password after deleting user', async () => {
    const token = await usersTokenRep.generate('NON EXISTING USER');

    await expect(
      resetPasswordService.execute({ token: token.token, newPassword: 'new-password' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset password after 2 hours', async () => {
    const user = await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const custmDate = new Date();
      return custmDate.setHours(custmDate.getHours() + 3);
    });
    const token = await usersTokenRep.generate(user.id);

    await expect(
      resetPasswordService.execute({ token: token.token, newPassword: 'new-password' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
