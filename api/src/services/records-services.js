import errors from './service-errors.js';
// To Do: Gamification, getAllRecords, updateRecord ?

const createRecord = recordsData => async (userId, bookId) => {
  const existingRecord = await recordsData.getBorrowedBy('book_id', bookId);

  if (existingRecord) {
    return {
      error: errors.DUPLICATE_RECORD,
      record: null,
    };
  }

  return {
    error: null,
    record: await recordsData.create(userId, bookId),
  };
};

const deleteRecord = recordsData => async (bookId) => {
  const bookToReturn = await recordsData.getBorrowedBy('book_id', bookId);

  if (!bookToReturn) {
    return {
      error: errors.RECORD_NOT_FOUND,
      record: null,
    };
  }

  const _ = await recordsData.remove(bookToReturn);

  return {
    error: null,
    record: bookToReturn,
  };
};

// const getAllRecords = booksData => async (data) => {

// };

// const updateRecord = booksData => async (id) => {

// };

export default {
  createRecord,
  deleteRecord,
};
