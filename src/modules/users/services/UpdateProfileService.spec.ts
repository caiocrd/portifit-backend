/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import UpdateProfileService from './UpdateProfileService';

let userRep: FakeUsersRepository;
let fakeHash: FakeHashProvider;
let updateProfileService: UpdateProfileService;
let createUserService: CreateUserService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    userRep = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(userRep, fakeHash);
    createUserService = new CreateUserService(userRep, fakeHash);
  });

  it('Should update existing profile', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    const user = await updateProfileService.execute({
      user_id: createdUser.id,
      name: 'NEW NAME',
      email: 'newemail@gmail.com',
    });
    expect(user.email).toEqual('newemail@gmail.com');
    expect(user.name).toEqual('NEW NAME');
  });

  it('Should update password on existing profile', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    const user = await updateProfileService.execute({
      user_id: createdUser.id,
      name: 'NEW NAME',
      email: 'newemail@gmail.com',
      old_password: '123456',
      new_password: 'NEW PASSWORD',
    });
    expect(user.password).toEqual(await fakeHash.generateHash('NEW PASSWORD'));
  });
  it('Should not update non existent user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'NON EXISTENTE ID',
        name: 'NEW NAME',
        email: 'newemail@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not update password with wrong old password', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        name: 'NEW NAME',
        email: 'newemail@gmail.com',
        old_password: 'WRONG OLD PASS',
        new_password: 'NEW PASSWORD',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not update email to existing email', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    await createUserService.execute({
      email: 'existing-email',
      name: 'Caio',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: createdUser.id,
        name: 'NEW NAME',
        email: 'existing-email',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
