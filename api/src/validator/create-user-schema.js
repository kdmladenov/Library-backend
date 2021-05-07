import { user } from '../common/constants.js';

export default {
  username: value => typeof value === 'string' && value.length >= user.MIN_USERNAME_LENGTH && value.length <= user.MAX_USERNAME_LENGTH,
  password: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  reenteredPassword: value => typeof value === 'string' && value.length <= user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
};
