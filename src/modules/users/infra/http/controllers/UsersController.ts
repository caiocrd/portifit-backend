import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '../../../services/CreateUserService';

export default class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password } = request.body;

      const userService = container.resolve(CreateUserService);
      return response.status(201).json(classToClass(await userService.execute({ name, email, password })));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
