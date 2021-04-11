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

const getAllBooks = booksData => async (data) => {
  const { search, sort, paging } = data;

  if (search) {
    const [term, column] = search.split(',');

    if (term) {
      const result = await booksData.searchBy(column, term);
      return result;
    }
  }

  if (sort) {
    const [column, order] = sort.split(',');

    if (column) {
      const result = await booksData.sortBy(column, order);
      return result;
    }
  }

  if (paging) {
    const [take, offset] = paging.split(',');
    // console.log(take, offset);
    if (take) {
      const result = await booksData.pagingBy(take, offset);
      return result;
    }
  }
  const result = await booksData.getAllBooks();

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
//Not finished
const updateBook = booksData => async (id, updateData) => {
  const book = await booksData.getBy('isbn', id)
            || await booksData.getBy('book_id', id);

  if (!book) {
    return {
      error: errors.RECORD_NOT_FOUND,
      book: null,
    };
  }

  if ((updateData.title && !(await booksData.getBy('title', updateData.title)))
    || (updateData.isdn && !(await booksData.getBy('isdn', updateData.isdn)))) {
    return {
      error: errors.DUPLICATE_RECORD,
      book: null,
    };
  }

  const updated = { ...book, ...updateData };
  const _ = await booksData.update(updated);

  return {
    error: null,
    book: updated,
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
export default {
  createBook,
  getBookById,
  getAllBooks,
  updateBook,
  deleteBook,
};
