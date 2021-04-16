import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';

import usersController from './controllers/users-controller.js';
import { PORT } from '../config.js';
import reviewsController from './controllers/reviews-controller.js';
import booksController from './controllers/book-controller.js';
import authController from './controllers/auth-controller.js';
import jwtStrategy from './authentication/strategy.js';
import recordsController from './controllers/records-controller.js';

const app = express();

passport.use(jwtStrategy);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(passport.initialize());

// USERS
app.use('/auth', authController);
app.use('/users', usersController);
app.use('/reviews', reviewsController);
app.use('/books', booksController);
app.use('/records', recordsController);

app.use((err, req, res, next) => {
  res.status(500).send({
    message: 'Ooops... Something went wrong - please, try again later!',
  });
});

// // LEVELING SYSTEM

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
