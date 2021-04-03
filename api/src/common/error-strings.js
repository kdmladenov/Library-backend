import { user as USER } from "./property-length-constraints.js";

export default {
  user: {
    username: `Expected string with length in the range [${USER.MIN_USERNAME_LENGTH}-${USER.MAX_USERNAME_LENGTH}]`,
    password: `Expected string with length in the range [${USER.MIN_PASSWORD_LENGTH}-${USER.MAX_PASSWORD_LENGTH}]`,
    firstName: `Expected string with length in the range [${USER.MIN_FIRSTNAME_LENGTH}-${USER.MAX_FIRSTNAME_LENGTH}]`,
    lastName: `Expected string with length in the range [${USER.MIN_LASTNAME_LENGTH}-${USER.MAX_LASTNAME_LENGTH}]`,
    email: `Expected string with length in the range [${USER.MIN_EMAIL_LENGTH}-${USER.MAX_EMAIL_LENGTH}]`,
    age: `Expected number`,
    gender: `Expected "Men", "Women" or "Other"`,
    isBanned: `Expected boolean`,
    isDeleted: `Expected boolean`,
    isAdmin: `Expected boolean`,
  },
  book: {

  },
};
