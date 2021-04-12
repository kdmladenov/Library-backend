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

  .delete('/books/:id', async (req, res) => {
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



  // .get('/books', (req, res) => {
  //   const { search, sort, take, offset = 0 } = req.query;
    
  //   if (search) {
  //     return res
  //     .status(200)
  //     .json(books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) && !b.isDeleted));
  //   }
    
  //   if (sort) {
  //     const [ sortKey, sortDirection ] = sort.split(',');
  //     if (['asc', 'desc'].includes(sortDirection)) {
  //       return res
  //         .status(200)
  //         .json(books
  //           .filter(b => !b.isDeleted)
  //           .sort((a, b) => a[sortKey].localeCompare(b[sortKey])
  //         * ((sortDirection === 'asc') ? 1 : -1)));
  //       }
  //     }
      
  // if (take && offset >= 0) {
  //   return res
  //   .status(200)
  //   .json(books.filter(b => !b.isDeleted).slice(+offset, +take + (+offset)));
  // }
  
  // res.status(200).json(books.filter(b => !b.isDeleted));
  // });