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

const getAllBooks = booksData => async (search, searchBy, sort, order, pageSize, page) => {
  const result = await booksData.getAllBooks(search, searchBy, sort, order, pageSize, page);

  return result;
};

const getBookById = booksData => async (id) => {
  const book = await booksData.getBy('isbn', id)
            || await booksData.getBy('book_id', id);

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
  console.log(bookId, updated, 's');

  const result = await booksData.update(updated);
  console.log(bookId, result, 's3');

  return {
    error: null,
    result,
  };
};

const deleteBook = booksData => async (id) => {
  const bookToDelete = await booksData.getBy('isbn', id)
                    || await booksData.getBy('book_id', id);

  if (!bookToDelete) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }

  const _ = await booksData.remove(bookToDelete);

  return {
    error: null,
    book: bookToDelete,
  };
};

const rateBook = bookRatingData => async (rating, userId, bookId) => {
  const existingRating = await bookRatingData.getBy(userId, bookId);

  if (existingRating && userId !== existingRating.userId) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

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
