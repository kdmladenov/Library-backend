import bookAgeRecommendation from '../common/book-age-recommendation.enum.js';
import bookGenre from '../common/book-genre.enum.js';
import bookLanguage from '../common/book-language.enum.js';
import { book } from '../common/property-length-constraints.js';

export const isbnRegex = /^\(?([0-9]{3})\)?[-]([0-9]{10})$/
export default {
  title: (value) => typeof value === 'string' && value.length >= book.MIN_TITLE_LENGTH && value.length <= book.MAX_TITLE_LENGTH,
  author: (value) => typeof value === 'string' && value.length >= book.MIN_AUTHOR_LENGTH && value.length <= book.MAX_AUTHOR_LENGTH,
  datePublished: (value) => typeof value === 'undefined' || (typeof value === 'string' && !(new Date(value).toString()).includes('Invalid') && new Date(value) > new Date(book.MIN_DATE_PUBLISHED)),
  genre: (value) => typeof value === 'undefined' || Object.keys(bookGenre).includes(value),
  isbn: (value) => typeof value === 'string' && isbnRegex.test(value),
  language: (value) => typeof value === 'undefined' || Object.keys(bookLanguage).includes(value),
  isDeleted: (value) => typeof value === 'undefined' || typeof value === 'boolean',
  summary: (value) => typeof value === 'undefined' || typeof value === 'string',
  ageRecommendation: (value) => typeof value === 'undefined' || Object.keys(bookAgeRecommendation).includes(value),
};
