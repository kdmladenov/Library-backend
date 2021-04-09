import { user } from '../common/property-length-constraints.js';
import gender from '../common/gender.enum.js';

const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
// need further validation of the password - regex!!!
const phoneRegex = /0-9/;
// need further validation of the phone - regex!!!
const passwordRegex = /0-9/;
export default {
  username: value => typeof value === 'string' && value.length > user.MIN_USERNAME_LENGTH && value.length < user.MAX_USERNAME_LENGTH && value.match(passwordRegex),
  password: value => typeof value === 'string' && value.length > user.MIN_PASSWORD_LENGTH && value.length < user.MAX_PASSWORD_LENGTH,
  firstName: value => typeof value === 'undefined' || (typeof value === 'string' && value.length > user.MIN_FIRSTNAME_LENGTH && value.length < user.MAX_FIRSTNAME_LENGTH),
  lastName: value => typeof value === 'undefined' || (typeof value === 'string' && value.length > user.MIN_LASTNAME_LENGTH && value.length < user.MAX_LASTNAME_LENGTH),
  gender: value => typeof value === 'undefined' || Object.keys(gender).includes(value),
  birthDate: value => typeof value === 'undefined' || (new Date(value) !== 'Invalid Date' && typeof value === 'string' && value.length > 0),
  email: value => typeof value === 'string' && value.length > user.MIN_EMAIL_LENGTH && value.length < user.MAX_EMAIL_LENGTH && value.match(emailRegex),
  phone: value => typeof value === 'undefined' || (typeof value === 'string' && value.match(phoneRegex)),
  // isAdmin: (value) => typeof value === 'boolean',
};
