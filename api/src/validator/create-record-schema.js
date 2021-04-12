import { record } from '../common/property-length-constraints.js';

export default {
  userId: (value) => typeof value === 'number' && value >= record.MIN_USER_ID_VALUE && value < record.MAX_USER_ID_VALUE,
};