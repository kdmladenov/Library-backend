import express from 'express';
import usersData from '../data/users-data.js';
import validateBody from '../middleware/validate-body.js';
import errors from '../services/service-errors.js';
import usersService from '../services/users-service.js';
import createUserSchema from '../validator/create-user-schema.js';
import updateUserSchema from '../validator/update-user-schema.js';
import updatePasswordSchema from '../validator/update-password-schema.js';
import { authMiddleware, roleMiddleware } from '../authentication/auth.middleware.js';
import rolesEnum from '../common/roles.enum.js';
import banUserSchema from '../validator/ban-user-schema.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import { paging } from '../common/constants.js';

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

  .get('/', authMiddleware, loggedUserGuard, async (req, res) => {
    const {
      search = '', searchBy = 'username', sort = 'username', order = 'ASC',
    } = req.query;
    let { pageSize = paging.DEFAULT_USERS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_USERS_PAGESIZE) pageSize = paging.MAX_USERS_PAGESIZE;
    if (+pageSize < paging.MIN_USERS_PAGESIZE) pageSize = paging.MIN_USERS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const { result } = await usersService.getAllUsers(usersData)(search, searchBy, sort, order, +page, +pageSize);

    res.status(200).send(result);
  })
  // get a single user
  .get('/:userId', authMiddleware, loggedUserGuard, async (req, res) => {
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
  .patch('/:userId/change-password', authMiddleware, loggedUserGuard, validateBody('user', updatePasswordSchema), async (req, res) => {
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

  // Update user
  .put('/:userId', authMiddleware, loggedUserGuard, validateBody('user', updateUserSchema), async (req, res) => {
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

  // Delete user
  .delete('/:userId', authMiddleware, loggedUserGuard, async (req, res) => {
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

  // Ban user
  .post('/:userId/ban', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), validateBody('ban', banUserSchema), async (req, res) => {
    const { userId } = req.params;
    const { duration, description } = req.body;

    const { error, result } = await usersService.banUser(usersData)(+userId, +duration, description);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  });

export default usersController;
