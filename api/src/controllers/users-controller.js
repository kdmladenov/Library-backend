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
    user.firstName = user.firstName || null;
    user.lastName = user.lastName || null;
    user.gender = user.gender || null;
    user.phone = user.phone || null;

    const { error, result } = await usersService.createUser(usersData)(user);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'User with same username or email already exists.',
      });
    } else {
      res.status(201).send(result);
    }
  })

  .get('/', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), async (req, res) => {
    const { role } = req.user;
    const {
      search = '', searchBy = 'username', sort = 'username', order = 'ASC',
    } = req.query;
    let { pageSize = paging.DEFAULT_USERS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_USERS_PAGESIZE) pageSize = paging.MAX_USERS_PAGESIZE;
    if (+pageSize < paging.MIN_USERS_PAGESIZE) pageSize = paging.MIN_USERS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const result = await usersService.getAllUsers(usersData)(search, searchBy, sort, order, +page, +pageSize, role);
console.log(result);
    res.status(200).send(result);
  })
  // get a single user
  .get('/:userId', authMiddleware, loggedUserGuard, async (req, res) => {
    const { userId } = req.params;
    const { role } = req.user;
    const isProfileOwner = +userId === req.user.userId;
    const { error, result } = await usersService.getUser(usersData)(userId, isProfileOwner, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${userId} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  })

  // Change password
  .patch('/change-password', authMiddleware, loggedUserGuard, validateBody('user', updatePasswordSchema), async (req, res) => {
    const { role } = req.user;
    const passwordData = req.body;
    const id = role === rolesEnum.admin ? req.body.userId : req.user.userId;

    const { error, result } = await usersService.changePassword(usersData)(passwordData, +id, role);

    if (error === errors.BAD_REQUEST) {
      res.status(400).send({
        message: 'The request was invalid. Passwords do not match.',
      });
    } else if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${id} is not found.`,
      });
    } else {
      res.status(200).send(result);
    }
  })

  // Update user
  .put('/edit-profile', authMiddleware, loggedUserGuard, validateBody('user', updateUserSchema), async (req, res) => {
    const { role } = req.user;
    const userUpdate = req.body;
    const id = role === rolesEnum.admin ? req.body.userId : req.user.userId;
    console.log(userUpdate);

    const { error, result } = await usersService.update(usersData)(userUpdate, +id);

    if (error === errors.BAD_REQUEST) {
      res.status(400).send({
        message: 'The request was invalid. Emails do not match.',
      });
    } else if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${id} is not found.`,
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
  .delete('/delete-profile', authMiddleware, loggedUserGuard, async (req, res) => {
    const { role } = req.user;
    const id = role === rolesEnum.admin ? req.body.userId : req.user.userId;

    const { error, result } = await usersService.deleteUser(usersData)(+id);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: `User ${id} is not found.`,
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
