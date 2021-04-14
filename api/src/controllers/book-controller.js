import express from 'express';
import booksData from '../data/books-data.js';
import validateBody from '../middleware/validate-body.js';
import errors from '../services/service-errors.js';
import createBookSchema from '../validator/create-book-schema.js';
import { book as BOOK } from '../common/constants.js';
import booksServices from '../services/books-services.js';
import bookGenreEnum from '../common/book-genre.enum.js';
import bookLanguageEnum from '../common/book-language.enum.js';
import bookAgeRecommendationEnum from '../common/book-age-recommendation.enum.js';
import reviewsData from '../data/reviews-data.js';
import createReviewSchema from '../validator/create-review-schema.js';
import reviewsService from '../services/reviews-service.js';
import recordsServices from '../services/records-services.js';
import recordsData from '../data/records-data.js';
import createRecordSchema from '../validator/create-record-schema.js';
import rateBookSchema from '../validator/rate-book-schema.js';
import bookRatingData from '../data/book-rating-data.js';
import { authMiddleware, roleMiddleware } from '../authentication/auth.middleware.js';

const booksController = express.Router();
// To Do: Authorization, Authentication, ?

booksController
  // create book
  .post('/', authMiddleware, roleMiddleware('admin'), validateBody('book', createBookSchema), async (req, res) => {
    const data = req.body;

    data.genre = bookGenreEnum[data.genre];
    data.language = bookLanguageEnum[data.language];
    data.ageRecommendation = bookAgeRecommendationEnum[data.ageRecommendation];

    const { error, book } = await booksServices.createBook(booksData)(data);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already exists.' });
    } else {
      res.status(201).send(book);
    }
  })
  // delete book
  .delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    const { id } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(id) ? id : +id;
    const { error, book } = await booksServices.deleteBook(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this id or isbn is not found!' });
    } else {
      res.status(200).send(book);
    }
  })
  // get by id
  .get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(id) ? id : +id;
    const { error, book } = await booksServices.getBookById(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this number is not found!' });
    } else {
      res.status(200).send(book);
    }
  })
  // get all - search, sort, paging
  .get('/', authMiddleware, async (req, res) => {
    const {
      search = '', searchBy = 'title', sort = 'bookId', order = 'ASC', pageSize = 10, page = 1,
    } = req.query;

    const book = await booksServices.getAllBooks(booksData)(search, searchBy, sort, order, +pageSize, +page);

    res.status(200).send(book);
  })
  // change book
  .put('/:bookId', authMiddleware, roleMiddleware('admin'), validateBody('rating', rateBookSchema), async (req, res) => {
    const { bookId } = req.params;
    const { rating, userId } = req.body;

    const { error, rate } = await booksServices.rateBook(bookRatingData)(+rating, +userId, +bookId);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({ message: 'You are not authorized to change this rating!' });
    } else {
      res.status(200).send(rate);
    }
  })
  // read review
  .get('/:bookId/reviews', authMiddleware, async (req, res) => {
    const { bookId } = req.params;
    const { order = 'ASC', page = 1, pageSize = 10 } = req.query;

    const { error, result } = await reviewsService.getAllReviews(reviewsData)(+bookId, order, +page, +pageSize);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  })
// create review
  .post('/:bookId/reviews', authMiddleware, validateBody('review', createReviewSchema), async (req, res) => {
    const { bookId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const { error, result } = await reviewsService.createReview(reviewsData)(content, userId, bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  })
  // Borrow a book
  .post('/:bookId/records', authMiddleware, validateBody('record', createRecordSchema), async (req, res) => {
    const { userId } = req.body;
    const { bookId } = req.params;

    const { error, record } = await recordsServices.createRecord(recordsData)(+userId, +bookId);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already borrowed!' });
    } else {
      res.status(201).send(record);
    }
  })
  // Return a book
  .delete('/:bookId/records', authMiddleware, async (req, res) => {
    const { bookId } = req.params;

    const { error, record } = await recordsServices.deleteRecord(recordsData)(+bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this id is currently not borrowed!' });
    } else {
      res.status(200).send(record);
    }
  })
  // Rate a book
  .put('/:bookId/rate', authMiddleware, validateBody('rating', rateBookSchema), async (req, res) => {
    const { bookId } = req.params;
    const { rating, userId } = req.body;

    const { error, rate } = await booksServices.rateBook(bookRatingData)(+rating, +userId, +bookId);

    if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({ message: 'You are not authorized to change this rating!' });
    } else {
      res.status(200).send(rate);
    }
  });
// .get('/books/rate', (req, res) => {
//   // bookId
//   // rating
// });

// // like a book
// app.put('/books/:id/bookVotes', (req, res) => {

// });

// // read all books
// .get('/admin/books', (res, req) => {

// });

// // read book by id
// .get('/admin/books/:id', (req, res) => {

// });

// // update book by id
// .put('/admin/books/:id', (req, res) => {

// });
export default booksController;
