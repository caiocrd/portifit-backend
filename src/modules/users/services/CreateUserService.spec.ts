/* eslint-disable @typescript-eslint/no-floating-promises */
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthUser', () => {
  let fakeRep: FakeUsersRepository;
  let fakeHash: FakeHashProvider;
  let service: CreateUserService;

  beforeEach(() => {
    fakeRep = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();

    service = new CreateUserService(fakeRep, fakeHash);
  });
  it('should be able to create a new user', async () => {
    const createdUser = await service.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    expect(createdUser).toHaveProperty('id');
  });
  it('should not be able to create a two users with same email', async () => {
    await service.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    await expect(
      service.execute({
        email: 'caio.crd@gmail.com',
        name: 'Caio',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
