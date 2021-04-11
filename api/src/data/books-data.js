import db from './pool.js';
// OK
const getAllBooks = async () => {
  const sql = `
    SELECT 
      b.book_id,
      b.title,
      b.author,
      b.date_published,
      b.isbn,
      b.is_deleted,
      g.genre,
      a.age_recommendation,
      l.language,
      b.summary
    FROM books b
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE is_deleted = 0
  `;

  return await db.query(sql);
};
// OK
const getBy = async (column, value) => {
  const sql = `
    SELECT 
      b.book_id,
      b.title,
      b.author,
      b.date_published,
      b.isbn,
      b.is_deleted,
      g.genre,
      a.age_recommendation,
      l.language,
      b.summary
    FROM books b
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE ${column} = ? AND is_deleted = 0;
  `;

  const result = await db.query(sql, [value]);
  return result[0];
};
// OK
const searchBy = async (column = 'title', value) => {
  const sql = `
        SELECT 
          b.book_id,
          b.title,
          b.author,
          b.date_published,
          b.isbn,
          b.is_deleted,
          g.genre,
          a.age_recommendation,
          l.language,
          b.summary
        FROM books b
        LEFT JOIN genres g USING (genre_id)
        LEFT JOIN age_recommendation a USING (age_recommendation_id)
        LEFT JOIN language l USING (language_id)
        WHERE ${column} LIKE '%${value}%' AND is_deleted = 0
    `;

  return await db.query(sql);
};

const pagingBy = async (take, offset = 0) => {
  const sql = `
        SELECT 
          b.book_id,
          b.title,
          b.author,
          b.date_published,
          b.isbn,
          b.is_deleted,
          g.genre,
          a.age_recommendation,
          l.language,
          b.summary
        FROM books b
        LEFT JOIN genres g USING (genre_id)
        LEFT JOIN age_recommendation a USING (age_recommendation_id)
        LEFT JOIN language l USING (language_id)
        WHERE is_deleted = 0
        LIMIT ?, ?;
    `;
    // console.log(take, offset);

  return await db.query(sql, [offset, take]);
};

const sortBy = async (column = 'title', order = 'ASC') => {
  const sql = `
        SELECT 
          b.book_id,
          b.title,
          b.author,
          b.date_published,
          b.isbn,
          b.is_deleted,
          g.genre,
          a.age_recommendation,
          l.language,
          b.summary
        FROM books b
        LEFT JOIN genres g USING (genre_id)
        LEFT JOIN age_recommendation a USING (age_recommendation_id)
        LEFT JOIN language l USING (language_id)
        WHERE is_deleted = 0
        ORDER BY ${column} ?;
    `;

  return await db.query(sql, [order]);
};

// Create - OK
const create = async (book) => {
  const sql = `
    INSERT INTO books (
      title,
      author,
      date_published,
      isbn,
      is_deleted,
      genre_id,
      age_recommendation_id,
      language_id,
      summary
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await db.query(sql, [
    book.title,
    book.author,
    book.date_published || null,
    +book.isbn || null,
    +book.is_deleted || 0,
    +book.genre || null,
    +book.age_recommendation || null,
    +book.language || null,
    book.summary || null,
  ]);

  return getBy('book_id', result.insertId);
};

// Not finished
const update = async (updated) => {
  const {
    title,
    author,
    date_published,
    isbn,
    is_deleted,
    genre_id,
    age_recommendation_id,
    language_id,
    summary,
    id,
  } = updated;

  const sql = `
        UPDATE books 
        SET
          title = ?,
          author = ?,
          date_published = ?,
          isbn = ?,
          is_deleted = ?,
          genre_id = ?,
          age_recommendation_id = ?,
          language_id = ?,
          summary = ?
        WHERE id = ?
    `;

  return db.query(sql, [
    title,
    author,
    date_published,
    isbn,
    is_deleted,
    genre_id,
    age_recommendation_id,
    language_id,
    summary,
    id,
  ]);
};

// OK
const remove = async (bookToDelete) => {
  const sql = `
        UPDATE books 
        SET is_deleted = true
        WHERE book_id = ?
    `;

  return await db.query(sql, [bookToDelete.book_id]);
};

export default {
  create,
  searchBy,
  getAllBooks,
  update,
  remove,
  getBy,
  sortBy,
  pagingBy,
};


// export const updateBook = (id, isBorrowed) => {
//   // 1. Check if book is available in the DB
//   // 2. Update isBorrowed value in the DB
//   // 3. Write a record in records
// };

