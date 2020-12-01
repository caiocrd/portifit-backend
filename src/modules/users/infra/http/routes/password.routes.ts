import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPassController = new ForgotPasswordController();
const resetPassController = new ResetPasswordController();
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPassController.create,
);
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
    },
  }),
  resetPassController.create,
);

export default passwordRouter;
