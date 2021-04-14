import express from 'express';
import usersData from '../data/users-data.js';
import errors from '../services/service-errors.js';
import usersService from '../services/users-service.js';
import createToken from '../authentication/create-token.js';
import validateBody from '../middleware/validate-body.js';
import loginUserSchema from '../validator/login-user-schema.js';
import { authMiddleware } from '../authentication/auth.middleware.js';


const authController = express.Router();

authController
  .post('/login', validateBody('user', loginUserSchema), async (req, res) => {
    const { username, password } = req.body;
    const { error, result } = await usersService.login(usersData)(username, password);

    if (error === errors.INVALID_LOGIN) {
      res.status(401).send({
        message: 'Invalid username/password.',
      });
    } else {
      const payload = {
        userId: result.userId,
        username: result.username,
        role: result.role,
      };
      const token = createToken(payload);

      res.status(200).send({ token });
    }
  })
  .delete('/logout', authMiddleware, async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    const _ = await usersService.logout(usersData)(token);

    res.status(200).send({
      message: 'You have logged out successfully!',
    });
  });

export default authController;
