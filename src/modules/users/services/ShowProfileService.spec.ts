import AppError from '../../../shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';

let userRep: FakeUsersRepository;
let fakehash: FakeHashProvider;
let showProfileService: ShowProfileService;
let createUserService: CreateUserService;

describe('ShowProfile', () => {
  beforeEach(() => {
    userRep = new FakeUsersRepository();
    fakehash = new FakeHashProvider();
    showProfileService = new ShowProfileService(userRep);

    createUserService = new CreateUserService(userRep, fakehash);
  });

  it('Should show existing profile', async () => {
    const createdUser = await createUserService.execute({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    const user = await showProfileService.execute(createdUser.id);
    expect(user.email).toEqual('caio.crd@gmail.com');
    expect(user.name).toEqual('Caio');
  });
  it('Should not show not existing profile', async () => {
    await expect(showProfileService.execute('NVALID ID')).rejects.toBeInstanceOf(AppError);
  });
});
