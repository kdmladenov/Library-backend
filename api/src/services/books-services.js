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

const getBookById = booksData => async (identifier) => {
  const book = await booksData.getBy('isbn', identifier)
            || await booksData.getBy('book_id', identifier);

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
//to Test
const rateBook = bookRatingData => async (rating, userId, bookId) => {
  const existingRating = await bookRatingData.getBy(userId, bookId);

  if (existingRating) {
    const result = await bookRatingData.update(rating, userId, bookId);

    return {
      error: null,
      rate: result,
    };
  }

  const result = await bookRatingData.create(rating, userId, bookId);

  return {
    error: null,
    rate: result,
  };
};
export default {
  createBook,
  getBookById,
  getAllBooks,
  rateBook,
  updateBook,
  deleteBook,
};
