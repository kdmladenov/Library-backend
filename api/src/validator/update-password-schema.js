import { user } from '../common/constants.js';

export default {
  currentPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  password: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  reenteredPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
