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
import recordsController from './controllers/records-controller.js';

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
// BOOKS
app.use('/', booksController);
// BORROW & RETURN BOOK
app.use('/', recordsController);

//   // BOOKS
//   // includes server-side pagination, filtering(searching) or sorting
//   app.get('/books', (req, res) => {
//     const { search, sort, take, offset = 0 } = req.query;

//     if (search) {
//       return res
//       .status(200)
//       .json(books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) && !b.isDeleted));
//     }

//     if (sort) {
//       const [ sortKey, sortDirection ] = sort.split(',');
//       if (['asc', 'desc'].includes(sortDirection)) {
//         return res
//         .status(200)
//         .json(books
//           .filter(b => !b.isDeleted)
//           .sort((a, b) => a[sortKey].localeCompare(b[sortKey])
//           * ((sortDirection === 'asc') ? 1 : -1)));
//         }
//       }

//   if (take && offset >= 0) {
//     return res
//     .status(200)
//     .json(books.filter(b => !b.isDeleted).slice(+offset, +take + (+offset)));
//   }

//   res.status(200).json(books.filter(b => !b.isDeleted));
// });

// /** Get a book by id and isbn combined */
// app.get('/books/:id', (req, res) => {
//   const { id } = req.params;
//   const book = books.find(b => (b.ISBN === +id || b.id === +id) && !b.isDeleted);

//   const book = books.find(b => (b.isbn === +id || b.id === +id) && !b.isDeleted);
  
//   if (!book) {
//     return res.status(404).json({ message: `The book was not found!` });
//   }

//   res.status(200).json(book);
// });

// // borrow/return a book
// app.patch('/book/:id', transformBody(updateBookSchema), validateBody('user', updateBookSchema), (req, res) => {
//   const { id } = req.params;
//   const { isBorrowed } = req.body;
//   updateBook(id, isBorrowed);

//   res.json({ message: `Book updated` });
// });

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
