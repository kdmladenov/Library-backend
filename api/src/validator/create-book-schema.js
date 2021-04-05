import bookAgeRecommendation from '../common/book-age-recommendation.enum.js';
import bookGenre from '../common/book-genre.enum.js';
import bookLanguage from '../common/book-language.enum.js';
import { book } from '../common/property-length-constraints.js';

/**
  title: `Expected string with length in the range [2-50]`,
  author: `Expected string with length in the range [6-60]`,
  datePublished: `Expected date string`,
  genre: `Expected a valid book genre`,
  ISBN: `Expected number with 10 digits`,
  language: `Expected element of the [Bulgarian, English, French,
    Russian, Spanish, German or Other]`,
  isBorrowed: `Expected boolean`,
  isDeleted: `Expected boolean`,
  ageRecommendation: `Expected element of the [All ages, Baby to 2 years, 3 to 5 years,
    6 to 8 years or 9 to 12 years]`,
 */

export default {
  title: (value) => typeof value === 'string' && value.length > book.MIN_TITLE_LENGTH && value < book.MAX_TITLE_LENGTH,
  author: (value) => typeof value === 'string' && value.length > book.MIN_AUTHOR_LENGTH && value < book.MAX_AUTHOR_LENGTH,
  datePublished: (value) => typeof value === 'string' && !(new Date(value).toString()).includes('Invalid'),
  genre: (value) => Object.values(bookGenre).includes(value),
  ISBN: (value) => typeof value === 'number' && value.toString().length === book.ISBN_LENGTH,
  language: (value) => Object.values(bookLanguage).includes(value),
  isBorrowed: (value) => typeof value === 'boolean',
  isDeleted: (value) => typeof value === 'boolean',
  ageRecommendation: (value) => Object.values(bookAgeRecommendation).includes(value),
};
