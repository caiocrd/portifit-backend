/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthService from './AuthService';

describe('AuthUser', () => {
  let fakeRep: FakeUsersRepository;
  let fakeHash: FakeHashProvider;
  let createUserService: CreateUserService;
  let authService: AuthService;
  let fakeCache: FakeCacheProvider;

  beforeEach(() => {
    fakeRep = new FakeUsersRepository();
    fakeHash = new FakeHashProvider();
    fakeCache = new FakeCacheProvider();
    createUserService = new CreateUserService(fakeRep, fakeHash, fakeCache);
    authService = new AuthService(fakeRep, fakeHash);
  });
  it('should be able to authenticate a user', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });
    const response = await authService.execute({ email: 'caio.crd@gmail.com', password: '123456' });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });
  it('should not be able to authenticate with invalid user', async () => {
    expect(authService.execute({ email: 'caio.crd@gmail.com', password: '123456' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
  it('should not be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });
    expect(
      authService.execute({ email: 'caio.crd@gmail.com', password: 'wrong-pass' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
