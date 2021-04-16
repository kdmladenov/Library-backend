import { readingPoints } from '../common/constants.js';
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

const deleteRecord = (recordsData, usersData) => async (bookId) => {
  const bookToReturn = await recordsData.getBorrowedBy('book_id', bookId);

  if (!bookToReturn) {
    return {
      error: errors.RECORD_NOT_FOUND,
      record: null,
    };
  }

  const { userId, dateToReturn } = bookToReturn;
  const days = Math.ceil((new Date(dateToReturn) - new Date()) / (24 * 60 * 60 * 1000)) > 0;
  const points = days > 0 ? 5 : Math.floor(days * readingPoints.RETURN_LATE_MULTIPLIER);

  const p = await usersData.updatePoints(userId, points);
  const r = await recordsData.remove(bookToReturn);

  return {
    error: null,
    record: bookToReturn,
  };
};

const getAllRecords = recordsData => async (search, searchBy, sort, order, pageSize, page, role, userId) => {
  const result = await recordsData.getAllRecords(search, searchBy, sort, order, pageSize, page, role, +userId);

  return result;
};

// const updateRecord = booksData => async (id) => {

// };

export default {
  createRecord,
  deleteRecord,
  getAllRecords,
};
