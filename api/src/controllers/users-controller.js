import express from 'express';
import usersData from '../data/users-data.js';
import validateBody from '../middleware/validate-body.js';
import errors from '../services/service-errors.js';
import usersService from '../services/users-service.js';
import createUserSchema from '../validator/create-user-schema.js';
import updateUserSchema from '../validator/update-user-schema.js';
import updatePasswordSchema from '../validator/update-password-schema.js';
import { authMiddleware, roleMiddleware } from '../authentication/auth.middleware.js';
import roles from '../common/roles.enum.js'

const usersController = express.Router();

usersController

// USERS - LOGOUT
// GET - all users

  // register
  .post('/', validateBody('user', createUserSchema), async (req, res) => {
    const user = req.body;
    const { error, result } = await usersService.createUser(usersData)(user);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'User with same username or email already exists.',
      });
    } else {
      res.status(201).send(result);
    }
  })

  // get a single user
  .get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { error, result } = await usersService.getUser(usersData)(userId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  })

  // Change password
  .patch('/:userId/change-password', authMiddleware, validateBody('user', updatePasswordSchema), async (req, res) => {
    const { userId: loggedUserId, role } = req.user;
    const { userId } = req.params;
    const passwordData = req.body;

    const { error, result } = await usersService.changePassword(usersData)(+userId, passwordData, +loggedUserId, role);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'No rights to update the password.',
      });
    } else if (error === errors.BAD_REQUEST) {
      res.status(400).send({
        message: 'The request was invalid. Passwords do not match.',
      });
    } else if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  })

  .put('/:userId', authMiddleware, validateBody('user', updateUserSchema), async (req, res) => {
    const { userId: loggedUserId, role } = req.user;
    const { userId } = req.params;
    const userUpdate = req.body;

    const { error, result } = await usersService.update(usersData)(userUpdate, +userId, +loggedUserId, role);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'No rights to update the password.',
      });
    } else if (error === errors.BAD_REQUEST) {
      res.status(400).send({
        message: 'The request was invalid. Emails do not match.',
      });
    } else if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'User with same email already exists.',
      });
    } else {
      res.status(200).send(result);
    }
  })

  .delete('/:userId', authMiddleware, async (req, res) => {
    const { userId: loggedUserId, role } = req.user;
    const { userId } = req.params;

    const { error, result } = await usersService.deleteUser(usersData)(+userId, +loggedUserId, role);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: `No rights to delete user ${userId}.`,
      });
    } else if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  })

  .post('/:userId/ban', authMiddleware, roleMiddleware(roles.admin), async (req, res) => {
    const { userId } = req.params;
    const { duration, description } = req.body;

    const { error, result } = await usersService.banUser(usersData)(+userId, +duration, description);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      })
    } else {
      res.status(200).send(result);
    }
  });

export default usersController;
