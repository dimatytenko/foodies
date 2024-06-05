import express from 'express';
import ctrlUser from '../controllers/authControllers.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const authRouter = express.Router();

import { authSignupSchema, authSigninSchema } from '../schemas/authSchemas.js';

authRouter.post(
  '/signup',
  isEmptyBody,
  validateBody(authSignupSchema),
  ctrlUser.signup
);

authRouter.post(
  '/signin',
  isEmptyBody,
  validateBody(authSigninSchema),
  ctrlUser.signin
);

authRouter.get('/current', authenticate, ctrlUser.getCurrent);

authRouter.post('/logout', authenticate, ctrlUser.logout);

authRouter.patch(
  '/avatars',
  upload.single('avatar'),
  authenticate,
  ctrlUser.updateAvatar
);

export default authRouter;
