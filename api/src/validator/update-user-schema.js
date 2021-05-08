import { user } from '../common/constants.js';
import gender from '../common/gender.enum.js';

export default {
  firstName: value => !value || (typeof value === 'string' && value.length >= user.MIN_FIRSTNAME_LENGTH && value.length <= user.MAX_FIRSTNAME_LENGTH),
  lastName: value => !value || (typeof value === 'string' && value.length >= user.MIN_LASTNAME_LENGTH && value.length <= user.MAX_LASTNAME_LENGTH),
  gender: value => !value || Object.keys(gender).includes(value),
  birthDate: value => !value || (new Date(value).toString() !== 'Invalid Date' && typeof value === 'string' && value.length > 0),
  email: value => typeof value === 'string' && value.length >= user.MIN_EMAIL_LENGTH && value.length <= user.MAX_EMAIL_LENGTH && user.EMAIL_REGEX.test(value),
  reenteredEmail: value => typeof value === 'string' && value.length >= user.MIN_EMAIL_LENGTH && value.length <= user.MAX_EMAIL_LENGTH && user.EMAIL_REGEX.test(value),
  phone: value => !value || (typeof value === 'string' && user.PHONE_REGEX.test(value)),
  userId: value => !value || (typeof value === 'number' && value > 0),
};
