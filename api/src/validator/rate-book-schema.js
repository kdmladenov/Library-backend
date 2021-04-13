import { book, record } from '../common/constants.js';

export default {
  userId: (value) => typeof value === 'number' && value >= record.MIN_USER_ID_VALUE && value < record.MAX_USER_ID_VALUE,
  rating: (value) => typeof value === 'number' && book.RATING_REGEX.test(value),
};
