/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-floating-promises */

import FakeDiskStorageProvider from '../../../shared/container/providers/StorageProvider/fakes/FakeDiskStorageProvider';
import AppError from '../../../shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  let userRep: FakeUsersRepository;
  let storage: FakeDiskStorageProvider;
  let updateavatarService: UpdateUserAvatarService;
  beforeEach(() => {
    userRep = new FakeUsersRepository();
    storage = new FakeDiskStorageProvider();
    updateavatarService = new UpdateUserAvatarService(userRep, storage);
  });
  it('Should update non existing avatar', async () => {
    const createdUser = await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    const user = await updateavatarService.execute({ user_id: createdUser.id, avatarFilename: 'avatar' });
    expect(user).toHaveProperty('avatar');
  });
  it('Should update existing avatar', async () => {
    const createdUser = await userRep.create({
      email: 'caio.crd@gmail.com',
      name: 'Caio',
      password: '123456',
    });

    await updateavatarService.execute({ user_id: createdUser.id, avatarFilename: 'avatar' });
    const user = await updateavatarService.execute({ user_id: createdUser.id, avatarFilename: 'new-avatar' });

    expect(user).toHaveProperty('avatar');
    expect(user.avatar).toEqual('new-avatar');
  });
  it('Should not update non existing user', async () => {
    expect(
      updateavatarService.execute({ user_id: 'fake-id', avatarFilename: 'avatar' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
