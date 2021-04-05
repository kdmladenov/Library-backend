import { user } from '../common/property-length-constraints.js';
import userGender from '../common/user-gender.enum.js';

/**
    username: `Expected string with length in the range [2-20]`,
    password: `Expected string with length in the range [6-20]`,
    firstName: `Expected string with length in the range [2-20]`,
    lastName: `Expected string with length in the range [2-20]`,
    email: `Expected string with length in the range [3-20]`,
    age: `Expected number`,
    gender: `Expected "Men", "Women" or "Other"`,
    isAdmin: `Expected boolean`,
 */

export default {
  username: (value) => typeof value === 'string' && value.length > user.MIN_USERNAME_LENGTH && value < user.MAX_USERNAME_LENGTH,
  password: (value) => typeof value === 'string' && value.length > user.MIN_PASSWORD_LENGTH && value < user.MAX_PASSWORD_LENGTH,
  firstName: (value) => typeof value === 'string' && value.length > user.MIN_FIRSTNAME_LENGTH && value < user.MAX_FIRSTNAME_LENGTH,
  lastName: (value) => typeof value === 'string' && value.length > user.MIN_LASTNAME_LENGTH && value < user.MAX_LASTNAME_LENGTH,
  email: (value) => typeof value === 'string' && value.length > user.MIN_EMAIL_LENGTH && value < user.MAX_EMAIL_LENGTH,
  birthDate: (value) => !(new Date(value) === 'Invalid Date') && typeof value === 'string' && value.length > 0,
  gender: (value) => Object.values(userGender).includes(value),
  // isAdmin: (value) => typeof value === 'boolean',
};
