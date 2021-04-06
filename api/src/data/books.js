// dummy data
export const books = [];

let id = 1;

export const getBooksId = () => id++;

export const createBook = (data) => {
  const book = {
    id: books.length + 1,
    ...data,
    isBorrowed: false,
    isDeleted: false,
  };

  return book;
};

export const updateBook = (id, isBorrowed) => {
  // 1. Check if book is available in the DB
  // 2. Update isBorrowed value in the DB
  // 3. Write a record in records
};
