import errors from './service-errors.js';

const createBook = booksData => async (data) => {
  const { title, isbn } = data;
  const existingBook = await booksData.getBookBy('isbn', isbn)
                    || await booksData.getBookBy('title', title);
console.log(data)

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

export default {
  createBook,
};
