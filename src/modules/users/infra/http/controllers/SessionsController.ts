import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateSessionService from '../../../services/AuthService';

export default class SessionsController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      const sessionService = container.resolve(CreateSessionService);
      return response.status(200).json(classToClass(await sessionService.execute({ email, password })));
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
