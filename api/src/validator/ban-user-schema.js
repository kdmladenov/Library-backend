import { ban } from '../common/constants.js';

export default {
  duration: value => typeof +value === 'number' && value >= ban.MIN_BAN_DURATION && value <= ban.MAX_BAN_DURATION,
  description: value => typeof value === 'string' && value.length >= ban.MIN_DESCRIPTION_LENGTH,
};
