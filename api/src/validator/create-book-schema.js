import bookAgeRecommendation from '../common/book-age-recommendation.enum.js';
import bookGenre from '../common/book-genre.enum.js';
import bookLanguage from '../common/book-language.enum.js';
import { book } from '../common/constants.js';

export default {
  title: (value) => typeof value === 'string' && value.length >= book.MIN_TITLE_LENGTH && value.length <= book.MAX_TITLE_LENGTH,
  author: (value) => typeof value === 'string' && value.length >= book.MIN_AUTHOR_LENGTH && value.length <= book.MAX_AUTHOR_LENGTH,
  datePublished: (value) => !value || (typeof value === 'string' && !(new Date(value).toString()).includes('Invalid') && new Date(value) > new Date(book.MIN_DATE_PUBLISHED)),
  genre: (value) => !value || Object.keys(bookGenre).includes(value),
  isbn: (value) => typeof value === 'string' && book.ISBN_REGEX.test(value),
  language: (value) => !value || Object.keys(bookLanguage).includes(value),
  isDeleted: (value) => !value || typeof value === 'boolean',
  summary: (value) => !value || typeof value === 'string',
  ageRecommendation: (value) => !value || Object.keys(bookAgeRecommendation).includes(value),
};
