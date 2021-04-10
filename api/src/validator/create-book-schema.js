import bookAgeRecommendation from '../common/book-age-recommendation.enum.js';
import bookGenre from '../common/book-genre.enum.js';
import bookLanguage from '../common/book-language.enum.js';
import { book } from '../common/property-length-constraints.js';

export default {
  title: (value) => typeof value === 'string' && value.length >= book.MIN_TITLE_LENGTH && value.length <= book.MAX_TITLE_LENGTH,
  author: (value) => typeof value === 'string' && value.length >= book.MIN_AUTHOR_LENGTH && value.length <= book.MAX_AUTHOR_LENGTH,
  date_published: (value) => typeof value === 'undefined' || (typeof value === 'string' && !(new Date(value).toString()).includes('Invalid')),
  genre: (value) => typeof value === 'undefined' || Object.keys(bookGenre).includes(value),
  isbn: (value) => typeof value === 'number' && value.toString().length === book.ISBN_LENGTH,
  language: (value) => typeof value === 'undefined' || Object.keys(bookLanguage).includes(value),
  is_deleted: (value) => typeof value === 'undefined' || typeof value === 'boolean',
  summary: (value) => typeof value === 'undefined' || typeof value === 'string',
  age_recommendation: (value) => typeof value === 'undefined' || Object.keys(bookAgeRecommendation).includes(value),
};
