import express from 'express';
import usersData from '../data/users-data.js';
import validateBody from '../middleware/validate-body.js';
import errors from '../services/service-errors.js';
import usersService from '../services/users-service.js';
import createUserSchema from '../validator/create-user-schema.js';
import injectUser from '../middleware/inject-user.js';

const usersController = express.Router();

usersController
  .post('/', validateBody('user', createUserSchema), async (req, res) => {
    const user = req.body;
    const { error, result } = await usersService.createUser(usersData)(user);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'User with same username or email already exists.' });
    } else {
      res.status(201).send(result);
    }
  })

  .get('/:userId', injectUser, async (req, res) => {

  })

  .patch('/:userId', injectUser, async (req, res) => {

  })

  .delete('/:userId', injectUser, async (req, res) => {
    const { userId } = req.user;
    const { userId: deletedUserId } = req.params;

    const { error, result } = await usersService.deleteUser(usersData)(userId, +deletedUserId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: `User with id = ${deletedUserId} is not found.` });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({ message: 'No rights to delete the user.' })
    } else {
      res.status(200).send(result);
    }
  })

// .get('/:id', )
// USERS - LOGIN - PUBLIC
// USERS - LOGOUT
export default usersController;
