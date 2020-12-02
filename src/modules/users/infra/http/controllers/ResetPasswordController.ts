import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '../../../services/ResetPasswordService';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { token, newPassword } = request.body;

      const resetPassService = container.resolve(ResetPasswordService);
      await resetPassService.execute({ token, newPassword });
      return response.status(204).json();
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
