import express from 'express';
import booksData from '../data/books-data.js';
import validateBody from '../middleware/validate-body.js';
import serviceErrors from '../services/service-errors.js';
import createBookSchema from '../validator/create-book-schema.js';
import booksServices from '../services/books-services.js';
import bookGenreEnum from '../common/book-genre.enum.js';
import bookLanguageEnum from '../common/book-language.enum.js';
import bookAgeRecommendationEnum from '../common/book-age-recommendation.enum.js';


const booksController = express.Router();

booksController
  .post('/', validateBody('book', createBookSchema), async (req, res) => {
    const data = req.body;

    data.genre = bookGenreEnum[data.genre];
    data.language = bookLanguageEnum[data.language];
    data.age_recommendation = bookAgeRecommendationEnum[data.age_recommendation];
    // data.date_published = new Date(data.date_published).toISOString().slice(0, 10);


    const { error, book } = await booksServices.createBook(booksData)(data);

    if (error === serviceErrors.DUPLICATE_RECORD) {
      res.status(409).send({ message: 'A book with same title or isbn already exists.' });
    } else {
      res.status(201).send(book);
    }
  })

  export default booksController;





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

