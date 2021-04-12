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

const booksController = express.Router();
// To Do: Authorization, Authentication, ?

booksController
  .post('/admin/books', validateBody('book', createBookSchema), async (req, res) => {
    const data = req.body;

    data.genre = bookGenreEnum[data.genre];
    data.language = bookLanguageEnum[data.language];
    data.ageRecommendation = bookAgeRecommendationEnum[data.ageRecommendation];
    // data.date_published = new Date(data.date_published).toISOString().slice(0, 10);

    const { error, book } = await booksServices.createBook(booksData)(data);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already exists.' });
    } else {
      res.status(201).send(book);
    }
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(id) ? id : +id;
    const { error, book } = await booksServices.getBookById(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this number is not found!' });
    } else {
      res.status(200).send(book);
    }
  })

  .get('/', async (req, res) => {
    const data = req.query;
    const book = await booksServices.getAllBooks(booksData)(data);

    res.status(200).send(book);
  })

  .delete('/admin/books/:id', async (req, res) => {
    const { id } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(id) ? id : +id;
    const { error, book } = await booksServices.deleteBook(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this id or isbn is not found!' });
    } else {
      res.status(200).send(book);
    }
  })

  // read review
  .get('/:bookId/reviews', async (req, res) => {
    const { bookId } = req.params;
    const { sort, page, limit } = req.query;

    const { error, result } = await reviewsService.getAllReviews(reviewsData)(bookId, sort, page, limit);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  })

// create review
  .post('/:bookId/reviews', validateBody('review', createReviewSchema), async (req, res) => {
    const { bookId } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const { error, result } = await reviewsService.createReview(reviewsData)(content, userId, bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'The book is not found.' });
    } else {
      res.status(200).send(result);
    }
  });

export default booksController;
