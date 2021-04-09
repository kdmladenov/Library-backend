import express from 'express';
import bcrypt from 'bcrypt';
import usersData from '../data/users-data.js';
import validateBody from '../middleware/validate-body.js';
import serviceErrors from '../services/service-errors.js';
import usersService from '../services/users-service.js';
import createUserSchema from '../validator/create-user-schema.js';

const usersController = express.Router();

usersController
  .post('/', validateBody('user', createUserSchema), async (req, res) => {
    console.log('usersController is running');
    const data = req.body;
    data.password = await bcrypt.hash(data.password, 10);

    const { error, user } = await usersService.createUser(usersData)(data);

    if (error === serviceErrors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'User with same username or email already exists.' });
    } else {
      res.status(201).send(user);
    }
  });

// .get('/:id', )
// USERS - LOGIN - PUBLIC
// USERS - LOGOUT
export default usersController;
