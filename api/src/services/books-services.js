import { readingPoints } from '../common/constants.js';
import errors from './service-errors.js';

const createBook = booksData => async (data) => {
  const { title, isbn } = data;

  const existingBook = await booksData.getBy('isbn', isbn)
                    || await booksData.getBy('title', title);

  if (existingBook) {
    return {
      error: errors.DUPLICATE_RECORD,
      book: null,
    };
  }
  return {
    error: null,
    book: await booksData.create(data),
  };
};

const getAllBooks = booksData => async (search, searchBy, sort, order, pageSize, page, role) => {
  const result = await booksData.getAllBooks(search, searchBy, sort, order, pageSize, page, role);

  return result;
};

const getBookById = booksData => async (identifier, role) => {
  const book = await booksData.getBy('isbn', identifier, role)
            || await booksData.getBy('book_id', identifier, role);

  if (!book) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }

  return {
    error: null,
    book,
  };
};

const updateBook = booksData => async (bookId, updatedData) => {
  const existingBook = await booksData.getBy('isbn', +bookId)
                    || await booksData.getBy('book_id', +bookId);

  if (!existingBook) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }
  // checks if the updated title or isbn exist in other book
  if ((updatedData.title && ((await booksData.getBy('title', updatedData.title)))
      && ((await booksData.getBy('title', updatedData.title)).bookId !== bookId))
        || (updatedData.isbn && ((await booksData.getBy('isbn', updatedData.isbn)))
          && ((await booksData.getBy('isbn', updatedData.isbn)).bookId !== bookId))) {
    return {
      error: errors.DUPLICATE_RECORD,
      book: null,
    };
  }

  const updated = { ...existingBook, ...updatedData };
  const result = await booksData.update(updated);

  return {
    error: null,
    result,
  };
};

const deleteBook = booksData => async (identifier) => {
  const bookToDelete = await booksData.getBy('isbn', identifier)
                    || await booksData.getBy('book_id', identifier);

  if (!bookToDelete) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }

  const _ = await booksData.remove(bookToDelete);

  return {
    error: null,
    book: ({ ...bookToDelete, "isDeleted": 1 }),
  };
};

// to Test
const rateBook = (bookRatingData, usersData, booksData, recordsData) => async (rating, userId, bookId) => {
  // checks if the book exists
  const existingBook = await booksData.getBy('book_id', bookId);
  if (!existingBook) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  // checks if the user has borrowed and returned the book
  const existingRecord = await recordsData.getRecordByUserIdAndBookId(userId, bookId);
  if (!existingRecord || existingRecord.dateReturned === null) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const existingRating = await bookRatingData.getBy(userId, bookId);

  if (existingRating) {
    const result = await bookRatingData.update(rating, userId, bookId);

    return {
      error: null,
      rate: result,
    };
  }

  const _ = usersData.updatePoints(userId, readingPoints.RATE_BOOK);
  const result = await bookRatingData.create(rating, userId, bookId);

  return {
    error: null,
    rate: result,
  };
};

const coverChange = booksData => async (path, bookId) => {
  const existingBook = await booksData.getBy('isbn', +bookId)
                    || await booksData.getBy('book_id', +bookId);

  if (!existingBook) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }

  const result = await booksData.coverChange(path, bookId);

  return {
    error: null,
    result,
  };
};

const getAllPublicBooks = booksData => async (sort, order, limit) => {
  const result = await booksData.getAllPublicBooks(sort, order, limit);

  return result;
};
export default {
  createBook,
  getBookById,
  getAllBooks,
  rateBook,
  updateBook,
  deleteBook,
  coverChange,
  getAllPublicBooks,
};
