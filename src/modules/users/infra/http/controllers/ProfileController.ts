import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class ProfileController {
  async update(request: Request, response: Response): Promise<Response> {
    const { email, name, old_password, new_password } = request.body;
    const user_id = request.user.id;
    const updateProfileService = container.resolve(UpdateProfileService);
    const user = await updateProfileService.execute({ email, name, user_id, old_password, new_password });
    return response.status(201).json(user);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);
    const user = await showProfileService.execute(user_id);
    return response.status(200).json(classToClass(user));
  }
}
