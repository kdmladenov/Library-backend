import { review } from '../common/constants.js';

export default {
  content: value => typeof value === 'string' && value.length >= review.MIN_CONTENT_LENGTH,
};
