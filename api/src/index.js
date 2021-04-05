import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import transformBody from './middleware/transform-body.js';
import validateBody from './middleware/validate-body.js';
import createUserScheme from './validator/create-user-scheme.js';
import { books } from './data/books.js';

const PORT = 5555;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// USERS - PUBLIC
app.post('/users', transformBody(createUserScheme), validateBody('user', createUserScheme), (req, res) => {

});

// USERS - LOGIN - PUBLIC

// USERS - LOGOUT

// BOOKS
app.get('/books', (req, res) => {
  if (req.query.title) {
    return res.status(200).json(books.filter(b => b.title.toLowerCase().includes(req.query.title.toLowerCase()) && !b.isDeleted));
  }

  res.status(200).json(books.filter(b => !b.isDeleted));
});

app.get('/books/:isbn', (req, res) => {
  const book = books.find(book => book.ISBN === +req.params.isbn && !book.isDeleted);
  if (!book) {
    return res.status(404).json({ message: `The book with ISBN ${req.params.isbn} was not found!` });
  }

  res.status(200).json(book);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(book => book.id === +req.params.id && !book.isDeleted);
  if (!book) {
    return res.status(404).json({ message: `The book with id ${req.params.id} was not found!` });
  }

  res.status(200).json(book);
});

// borrow/return a book
app.patch('/book/:id', (req, res) => {

});

// like a book
app.put('/books/:id/bookVotes', (req, res) => {

});

// read review
app.get('/books/:id/reviews', (req, res) => {

});

// create review
app.post('/books/:id/reviews', (req, res) => {

});

// update review
app.put('/books/:id/reviews/:reviewId', (req, res) => {

});

// delete review
app.delete('/books/:id/reviews/:reviewId', (req, res) => {

});

// SHOULD

// rate book
app.put('/books/:id/rate', (req, res) => {

});

// filter: books query --> sort/filter: rating
app.get('/books/rate', (req, res) => {
  // bookId
  // rating
});

// like review
app.put('/reviews/:id/reviewVotes', (req, res) => {

});

// Administration Part: CRUD a book, CRUD a review, 
// read all books
app.get('/admin/books', (res, req) => {

});

// read book by id
app.get('/admin/books/:id', (req, res) => {

});

// create a book
app.post('/admin/books', (req, res) => {

});

// update book by id
app.put('/admin/books/:id', (req, res) => {

});

// delete book by id
app.delete('/admin/books/:id', (req, res) => {

});

// read all reviews by book id
app.get('/admin/books/:id/reviews', (req, res) => {

});

// read book review by id
app.get('/admin/reviews/:id', (req, res) => {

});

// create book review
app.post('/admin/reviews', (req, res) => {

});

// update book review
app.put('/admin/books/:id/reviews/:id', (req, res) => {

});

// delete book review
app.delete('/admin/books/:id/reviews/:id', (req, res) => {

});

// bann an user
app.put('/admin/users/:id', (req, res) => {

});

// delete an user
app.delete('/admin/users/:id', (req, res) => {

});

// LEVELING SYSTEM
