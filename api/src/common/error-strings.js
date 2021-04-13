import {
  user as USER,
  book as BOOK,
  review as REVIEW,
  record as RECORD,
} from "./constants.js";

export default {
  user: {
    username: `Expected string with length in the range [${USER.MIN_USERNAME_LENGTH}-${USER.MAX_USERNAME_LENGTH}]`,
    password: `Expected string with length in the range [${USER.MIN_PASSWORD_LENGTH}-${USER.MAX_PASSWORD_LENGTH}]`,
    firstName: `Expected string with length in the range [${USER.MIN_FIRSTNAME_LENGTH}-${USER.MAX_FIRSTNAME_LENGTH}]`,
    lastName: `Expected string with length in the range [${USER.MIN_LASTNAME_LENGTH}-${USER.MAX_LASTNAME_LENGTH}]`,
    email: `Expected string with length in the range [${USER.MIN_EMAIL_LENGTH}-${USER.MAX_EMAIL_LENGTH}]`,
    phone: `Expected string... `,
    birthDate: `Expected a valid date string`,
    gender: `Expected "Men", "Women" or "Other"`,
    isBanned: `Expected boolean`,
    isDeleted: `Expected boolean`,
    isAdmin: `Expected boolean`,
  },
  book: {
    title: `Expected string with length in the range [${BOOK.MIN_TITLE_LENGTH}-${BOOK.MAX_TITLE_LENGTH}]`,
    author: `Expected string with length in the range [${BOOK.MIN_AUTHOR_LENGTH}-${BOOK.MAX_AUTHOR_LENGTH}]`,
    datePublished: `Expected date string with year 1900 till current`,
    genre: `Expected a valid book genre`,
    isbn: `Expected string of 3 and 10 digits separated by a dash in the format XXX-XXXXXXXXXXXX`,
    language: `Expected element of the [Bulgarian, English, French, Russian, Spanish, German or Other]`,
    isDeleted: `Expected boolean`,
    ageRecommendation: `Expected element of the [All ages, Baby to 2 years, 3 to 5 years, 6 to 8 years or 9 to 12 years]`,
    summary: `Expected string`,
  },
  record: {
    userId: `Expected number in the range [${RECORD.MAX_USER_ID_VALUE}-${RECORD.MAX_USER_ID_VALUE}]`,
  },
  review: {
    content: `Expected string with length more than ${REVIEW.MIN_CONTENT_LENGTH} characters.`,
  },
  rating: {
    userId: `Expected a positive number`,
    rating: `Expected a whole number in the range [0 - 5]`,
  },
  vote: {
    userId: `Expected a positive number`,
    reactionId: `Expected a positive number`,
  },
};
