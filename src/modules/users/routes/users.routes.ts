import { Router } from 'express';
import UsersController from '../controllers/UsersController';
import { celebrate, Joi, Segments } from 'celebrate';

const usersRouter = Router();
const userController = new UsersController();

usersRouter.get('/', userController.index);

usersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  userController.show,
);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  userController.create,
);

export default usersRouter;
