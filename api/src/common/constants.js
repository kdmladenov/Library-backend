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
  // need further validation of the phone - regex!!!
  PHONE_REGEX: /0-9/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, // letters, numbers and at least 1 uppercase
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
