import { review } from '../common/property-length-constraints.js';

export default {
  content: value => typeof value === 'string' && value.length > review.MIN_CONTENT_LENGTH,
};
