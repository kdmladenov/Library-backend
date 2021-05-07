import express from 'express';
import booksData from '../data/books-data.js';
import validateBody from '../middleware/validate-body.js';
import errors from '../services/service-errors.js';
import createBookSchema from '../validator/create-book-schema.js';
import { book as BOOK, paging } from '../common/constants.js';
import booksServices from '../services/books-services.js';
import bookGenreEnum from '../common/book-genre.enum.js';
import bookLanguageEnum from '../common/book-language.enum.js';
import bookAgeRecommendationEnum from '../common/book-age-recommendation.enum.js';
import reviewsData from '../data/reviews-data.js';
import createReviewSchema from '../validator/create-review-schema.js';
import reviewsService from '../services/reviews-service.js';
import recordsServices from '../services/records-services.js';
import recordsData from '../data/records-data.js';
// import rateBookSchema from '../validator/rate-book-schema.js';
import bookRatingData from '../data/book-rating-data.js';
import { authMiddleware, roleMiddleware } from '../authentication/auth.middleware.js';
import banGuard from '../middleware/banGuard.js';
import rolesEnum from '../common/roles.enum.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import updateBookSchema from '../validator/update-book-schema.js';
import uploadCover from '../middleware/upload-cover.js';
import validateFile from '../middleware/validate-file.js';
import uploadFileSchema from '../validator/upload-file-schema.js';
import usersData from '../data/users-data.js';
import errorHandler from '../middleware/errorHandler.js';

const booksController = express.Router();

booksController
  // create book
  .post('/', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), validateBody('book', createBookSchema), errorHandler(async (req, res) => {
    const data = req.body;

    data.genre = bookGenreEnum[data.genre];
    data.language = bookLanguageEnum[data.language];
    data.ageRecommendation = bookAgeRecommendationEnum[data.ageRecommendation];

    const { error, book } = await booksServices.createBook(booksData)(data);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'A book with same title or isbn already exists.',
      });
    } else {
      res.status(201).send(book);
    }
  }))

  // delete book
  .delete('/:bookId', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), errorHandler(async (req, res) => {
    const { bookId } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(bookId) ? bookId : +bookId;
    const { error, book } = await booksServices.deleteBook(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'A book with this id or isbn is not found!',
      });
    } else {
      res.status(200).send(book);
    }
  }))

  // get by id
  .get('/:bookId', authMiddleware, loggedUserGuard, errorHandler(async (req, res) => {
    const { bookId } = req.params;

    const identifier = BOOK.ISBN_REGEX.test(bookId) ? bookId : +bookId;
    const { error, book } = await booksServices.getBookById(booksData)(identifier);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'A book with this number is not found!',
      });
    } else {
      res.status(200).send(book);
    }
  }))

  // get all books - search, sort, paging
  .get('/', authMiddleware, loggedUserGuard, errorHandler(async (req, res) => {
    const {
      search = '', searchBy = 'title', sort = 'bookId', order = 'ASC',
    } = req.query;
    const { role } = req.user;

    let { pageSize = paging.DEFAULT_BOOKS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_BOOKS_PAGESIZE) pageSize = paging.MAX_BOOKS_PAGESIZE;
    if (+pageSize < paging.MIN_BOOKS_PAGESIZE) pageSize = paging.MIN_BOOKS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const book = await booksServices.getAllBooks(booksData)(search, searchBy, sort, order, +pageSize, +page, role);

    res.status(200).send(book);
  }))

  // change book
  .put('/:bookId', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), validateBody('book', updateBookSchema), errorHandler(async (req, res) => {
    const { bookId } = req.params;
    const data = req.body;

    const { error, result } = await booksServices.updateBook(booksData)(+bookId, data);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The book is not found.',
      });
    } else if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'Another book with this title and/or isbn already exist.',
      });
    } else {
      res.status(200).send(result);
    }
  }))

  // read review
  .get('/:bookId/reviews', authMiddleware, loggedUserGuard, errorHandler(async (req, res) => {
    const { bookId } = req.params;
    const { order = 'ASC' } = req.query;
    let { pageSize = paging.DEFAULT_REVIEWS_PAGESIZE, page = paging.DEFAULT_PAGE } = req.query;

    if (+pageSize > paging.MAX_REVIEWS_PAGESIZE) pageSize = paging.MAX_REVIEWS_PAGESIZE;
    if (+pageSize < paging.MIN_REVIEWS_PAGESIZE) pageSize = paging.MIN_REVIEWS_PAGESIZE;
    if (page < paging.DEFAULT_PAGE) page = paging.DEFAULT_PAGE;

    const { error, result } = await reviewsService.getAllReviews(reviewsData, booksData)(+bookId, order, +page, +pageSize);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The book is not found.',
      });
    } else {
      res.status(200).send(result);
    }
  }))

// create review
  .post('/:bookId/reviews', authMiddleware, loggedUserGuard, banGuard, validateBody('review', createReviewSchema), errorHandler(async (req, res) => {
    const { bookId } = req.params;
    const { content, rating, title } = req.body;
    const { userId } = req.user;

    const { error, result } = await reviewsService.createReview(booksData, reviewsData, recordsData, usersData)(content, +userId, +bookId, +rating, title);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'The book is not found.',
      });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: `Only an user who has borrowed and returned the book is allowed to write a review.`,
      });
    } else if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: `User with userId ${userId} has already reviewed the book.`,
      });
    } else {
      res.status(201).send(result);
    }
  }))

  // Borrow a book
  .post('/:bookId/records', authMiddleware, loggedUserGuard, banGuard, errorHandler(async (req, res) => {
    const { userId } = req.user;
    const { bookId } = req.params;

    const { error, record } = await recordsServices.createRecord(recordsData)(+userId, +bookId);

    if (error === errors.DUPLICATE_RECORD) {
      res.status(409).send({
        message: 'A book with same title or isbn already borrowed!',
      });
    } else {
      res.status(201).send(record);
    }
  }))

  // Return a book
  .delete('/:bookId/records', authMiddleware, loggedUserGuard, errorHandler(async (req, res) => {
    const { userId, role } = req.user;
    const { bookId } = req.params;

    const { error, record } = await recordsServices.deleteRecord(recordsData, usersData)(+bookId, +userId, role);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'A book with this id is currently not borrowed!',
      });
    } else if (error === errors.OPERATION_NOT_PERMITTED) {
      res.status(403).send({
        message: 'You are not authorized to return this book!',
      });
    } else {
      res.status(200).send(record);
    }
  }))

  // Rate a book
  // .put('/:bookId/rate', authMiddleware, loggedUserGuard, banGuard, validateBody('rating', rateBookSchema), errorHandler(async (req, res) => {
  //   const { bookId } = req.params;
  //   const { rating } = req.body;
  //   const { userId } = req.user;
  //   const { error, rate } = await booksServices.rateBook(bookRatingData, usersData, booksData, recordsData)(+rating, +userId, +bookId);
  //   if (error === errors.RECORD_NOT_FOUND) {
  //     res.status(404).send({
  //       message: 'The book is not found.',
  //     });
  //   } else if (error === errors.OPERATION_NOT_PERMITTED) {
  //     res.status(403).send({
  //       message: `Only an user who has borrowed and returned the book is allowed to rate.`,
  //     });
  //   } else {
  //     res.status(200).send(rate);
  //   }
  // }))
  // Update cover
  .put('/:bookId/cover', authMiddleware, loggedUserGuard, roleMiddleware(rolesEnum.admin), uploadCover.single('cover'), validateFile('uploads', uploadFileSchema), errorHandler(async (req, res) => {
    const { path } = req.file;
    const { bookId } = req.params;

    const { error, _ } = await booksServices.coverChange(booksData)(path.replace(/\\/g, '/'), +bookId);

    if (error === errors.RECORD_NOT_FOUND) {
      res.status(404).send({
        message: 'A book with this number is not found!',
      });
    } else {
      res.status(200).send({ message: 'The cover is changed' });
    }
  }));

export default booksController;
