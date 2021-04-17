import { user } from '../common/constants.js';
import gender from '../common/gender.enum.js';

export default {
  firstName: value => typeof value === 'undefined' || (typeof value === 'string' && value.length >= user.MIN_FIRSTNAME_LENGTH && value.length <= user.MAX_FIRSTNAME_LENGTH),
  lastName: value => typeof value === 'undefined' || (typeof value === 'string' && value.length >= user.MIN_LASTNAME_LENGTH && value.length <= user.MAX_LASTNAME_LENGTH),
  gender: value => typeof value === 'undefined' || Object.keys(gender).includes(value),
  birthDate: value => typeof value === 'undefined' || (new Date(value).toString() !== 'Invalid Date' && typeof value === 'string' && value.length > 0),
  newEmail: value => typeof value === 'undefined' || (typeof value === 'string' && value.length <= user.MAX_EMAIL_LENGTH && value.match(user.EMAIL_REGEX)),
  reenteredNewEmail: value => typeof value === 'undefined' || (typeof value === 'string' && value.length <= user.MAX_EMAIL_LENGTH && value.match(user.EMAIL_REGEX)),
  phone: value => typeof value === 'undefined' || (typeof value === 'string' && value.match(user.PHONE_REGEX)),
  userId: value => typeof value === 'undefined' || (typeof value === 'number' && value > 0),
};
