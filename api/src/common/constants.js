export const user = {
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 20,
  MIN_FIRSTNAME_LENGTH: 2,
  MAX_FIRSTNAME_LENGTH: 20,
  MIN_LASTNAME_LENGTH: 2,
  MAX_LASTNAME_LENGTH: 20,
  MIN_EMAIL_LENGTH: 4,
  MAX_EMAIL_LENGTH: 50,
  EMAIL_REGEX: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
  PHONE_REGEX: /^\(?(0[0-9]{3})\)?[-\s]?([0-9]{3})[-\s]?([0-9]{3})$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, // letters, numbers and at least 1 uppercase
  DEFAULT_AVATAR: `storage/avatars/defaultAvatar.png`,
};

export const book = {
  MIN_TITLE_LENGTH: 2,
  MAX_TITLE_LENGTH: 50,
  MIN_AUTHOR_LENGTH: 6,
  MAX_AUTHOR_LENGTH: 60,
  MIN_DATE_PUBLISHED: '1900-01-01',
  ISBN_REGEX: /^\(?([0-9]{3})\)?[-]([0-9]{10})$/,
  RATING_REGEX: /^[1-5]$/,
};

export const review = {
  MIN_CONTENT_LENGTH: 2,
  MIN_TITLE_LENGTH: 2,
  MAX_TITLE_LENGTH: 255,
};

export const record = {
  MIN_USER_ID_VALUE: 0,
};

export const vote = {
  MIN_REACTION_ID_VALUE: 0,
  MIN_REVIEW_ID_VALUE: 0,
};

export const ban = {
  MIN_BAN_DURATION: 1,
  MAX_BAN_DURATION: 30,
  MIN_DESCRIPTION_LENGTH: 2,
};

export const paging = {
  DEFAULT_PAGE: 1,
  MIN_REVIEWS_PAGESIZE: 5,
  MAX_REVIEWS_PAGESIZE: 15,
  DEFAULT_REVIEWS_PAGESIZE: 10,
  MIN_BOOKS_PAGESIZE: 5,
  MAX_BOOKS_PAGESIZE: 15,
  DEFAULT_BOOKS_PAGESIZE: 10,
  MIN_USERS_PAGESIZE: 5,
  MAX_USERS_PAGESIZE: 15,
  DEFAULT_USERS_PAGESIZE: 10,
  MIN_RECORDS_PAGESIZE: 5,
  MAX_RECORDS_PAGESIZE: 15,
  DEFAULT_RECORDS_PAGESIZE: 10,
};

export const uploads = {
  VALID_FILE_FORMATS: ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'webp'],
  MAX_FILE_SIZE: 102400, //   divide by 1000 for KB
  MIN_FILE_SIZE: 0,
};
export const readingPoints = {
  RETURN_ON_TIME: 5,
  RETURN_LATE_MULTIPLIER: -0.2,
  POST_REVIEW: 15,
  DELETE_REVIEW: -15,
  RATE_BOOK: 0,
  GET_BANNED_MULTIPLIER: -0.2,
};
