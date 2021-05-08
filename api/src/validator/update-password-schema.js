import { user } from '../common/constants.js';

export default {
  currentPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && user.PASSWORD_REGEX.test(value),
  password: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && user.PASSWORD_REGEX.test(value),
  reenteredPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && user.PASSWORD_REGEX.test(value),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
