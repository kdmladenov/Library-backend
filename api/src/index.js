import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const PORT = 5555;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

// USERS - PUBLIC
app.post('/users', (req, res) => {

});

// USERS - LOGIN - PUBLIC

// USERS - LOGOUT

// BOOKS
app.get('/books', (req, res) => {
  // title
  // author
  // language
  // genre
  // available
  // isbn ???
});

app.get('/books/:isbn', (req, res) => {

});

app.get('/books/:id', (req, res) => {

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
