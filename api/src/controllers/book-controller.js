import express from 'express';
import booksData from '../data/books-data.js';
import validateBody from '../middleware/validate-body.js';
import serviceErrors from '../services/service-errors.js';
import createBookSchema, { isbnRegex } from '../validator/create-book-schema.js';
import booksServices from '../services/books-services.js';
import bookGenreEnum from '../common/book-genre.enum.js';
import bookLanguageEnum from '../common/book-language.enum.js';
import bookAgeRecommendationEnum from '../common/book-age-recommendation.enum.js';

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

    if (error === serviceErrors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already exists.' });
    } else {
      res.status(201).send(book);
    }
  })

  .get('/books/:id', async (req, res) => {
    const { id } = req.params;

    const identifier = isbnRegex.test(id) ? id : +id;
    const { error, book } = await booksServices.getBookById(booksData)(identifier);

    if (error === serviceErrors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this number is not found!' });
    } else {
      res.status(200).send(book);
    }
  })

  .get('/books', async (req, res) => {
    const data = req.query;
    const book = await booksServices.getAllBooks(booksData)(data);

    res.status(200).send(book);
  })

  .delete('/admin/books/:id', async (req, res) => {
    const { id } = req.params;

    const identifier = isbnRegex.test(id) ? id : +id;
    const { error, book } = await booksServices.deleteBook(booksData)(identifier);

    if (error === serviceErrors.RECORD_NOT_FOUND) {
      res.status(404).send({ message: 'A book with this id or isbn is not found!' });
    } else {
      res.status(200).send(book);
    }
  });

export default booksController;
