// dummy data
export const books = [];

let id = books.length;

export const getBooksId = () => ++id;

export const createBook = (req, res) => {
  const book = {
    ...req.body,
    isBorrowed: false,
    isDeleted: false,
  };
  books.push(book);
  return book;
};

export const updateBook = (id, isBorrowed) => {
  // 1. Check if book is available in the DB
  // 2. Update isBorrowed value in the DB
  // 3. Write a record in records
};
