import { user } from '../common/constants.js';

export default {
  username: value => typeof value === 'string' && value.length >= user.MIN_USERNAME_LENGTH && value.length <= user.MAX_USERNAME_LENGTH,
  email: value => typeof value === 'string' && user.EMAIL_REGEX.test(value),
  password: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && user.PASSWORD_REGEX.test(value),
  reenteredPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && user.PASSWORD_REGEX.test(value),
};
