import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
profileRouter.use(ensureAuthenticated);
const profileController = new ProfileController();

profileRouter.patch(
  '/update',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      new_password: Joi.string(),
      confirm_password: Joi.string().valid(Joi.ref('new_password')),
    },
  }),
  profileController.update,
);
profileRouter.get('/show', profileController.show);

export default profileRouter;
