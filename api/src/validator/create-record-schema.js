import { record } from '../common/constants.js';

export default {
  userId: (value) => typeof value === 'number' && value >= record.MIN_USER_ID_VALUE,
};
