/* eslint-disable array-bracket-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
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

// import transformBody from './middleware/transform-body.js';
// import validateBody from './middleware/validate-body.js';
// import createBookScheme from './validator/create-book-schema.js';
// import updateBookSchema from './validator/update-book-schema.js';
// import { books, createBook, updateBook } from './data/books.js';

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

// // LEVELING SYSTEM

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
