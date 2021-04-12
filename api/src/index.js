/* eslint-disable array-bracket-spacing */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import usersController from './controllers/users-controller.js';
import { PORT } from '../../config.js';
import reviewsController from './controllers/reviews-controller.js';
import booksController from './controllers/book-controller.js';
import adminController from './controllers/admin-controller.js';

// import transformBody from './middleware/transform-body.js';
// import validateBody from './middleware/validate-body.js';
// import createBookScheme from './validator/create-book-schema.js';
// import updateBookSchema from './validator/update-book-schema.js';
// import { books, createBook, updateBook } from './data/books.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// USERS
app.use('/users', usersController);
app.use('/reviews', reviewsController);
app.use('/books', booksController);
app.use('/admin', adminController);

// // like a book
// app.put('/books/:id/bookVotes', (req, res) => {

// });

// // SHOULD

// // rate book
// app.put('/books/:id/rate', (req, res) => {

// });

// // filter: books query --> sort/filter: rating
// app.get('/books/rate', (req, res) => {
//   // bookId
//   // rating
// });

// // like review
// app.put('/reviews/:id/reviewVotes', (req, res) => {

// });

// // Administration Part: CRUD a book, CRUD a review,
// // read all books
// app.get('/admin/books', (res, req) => {

// });

// // read book by id
// app.get('/admin/books/:id', (req, res) => {

// });

// // create a book
// app.post('/admin/books', transformBody(createBookScheme), validateBody('book', createBookScheme), (req, res) => {
//   const book = createBook(req, res);

//   res.json(book);
// });

// // update book by id
// app.put('/admin/books/:id', (req, res) => {

// });

// // delete book by id
// app.delete('/admin/books/:id', (req, res) => {

// });

// // read all reviews by book id
// app.get('/admin/books/:id/reviews', (req, res) => {

// });

// // read book review by id
// app.get('/admin/reviews/:id', (req, res) => {

// });

// // create book review
// app.post('/admin/reviews', (req, res) => {

// });

// // update book review
// app.put('/admin/books/:id/reviews/:id', (req, res) => {

// });

// // delete book review
// app.delete('/admin/books/:id/reviews/:id', (req, res) => {

// });

// // bann an user
// app.put('/admin/users/:id', (req, res) => {

// });

// // delete an user
// app.delete('/admin/users/:id', (req, res) => {

// });

// // LEVELING SYSTEM

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
