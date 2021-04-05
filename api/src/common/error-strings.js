import { user as USER } from "./property-length-constraints.js";
import { book as BOOK } from "./property-length-constraints.js";

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
    title: `Expected string with length in the range [${BOOK.MIN_TITLE_LENGTH}-${BOOK.MAX_TITLE_LENGTH}]`,
    author: `Expected string with length in the range [${BOOK.MIN_AUTHOR_LENGTH}-${BOOK.MAX_AUTHOR_LENGTH}]`,
    datePublished: `Expected date string`,
    genre: `Expected a valid book genre`,
    ISBN: `Expected number with ${BOOK.ISBN_LENGTH} digits`,
    language: `Expected element of the [Bulgarian, English, French, Russian, Spanish, German or Other]`,
    isBorrowed: `Expected boolean`,
    isDeleted: `Expected boolean`,
    ageRecommendation: `Expected element of the [All ages, Baby to 2 years, 3 to 5 years, 6 to 8 years or 9 to 12 years]`,
  },
};
