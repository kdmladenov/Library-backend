import { user } from '../common/constants.js';

export default {
  oldPassword: value => typeof value === 'string' && value.length < user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  newPassword: value => typeof value === 'string' && value.length < user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  reenteredNewPassword: value => typeof value === 'string' && value.length < user.MAX_PASSWORD_LENGTH && value.match(user.PASSWORD_REGEX),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
