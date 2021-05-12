import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';
// OK
const getAllBooks = async (search, searchBy, sort, order, pageSize, page, role) => {
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'asc';
  const searchColumn = [
    'book_id', 'title', 'author', 'date_published', 'isbn', 'genre', 'language', 'summary', 'bookRating', 'borrowedUntil', 'pages', 'reviewCount', 'timesBorrowed', 'borrowedByUser', 'dateReturned'].includes(searchBy) ? searchBy : 'title';
  const sortColumn = [
    'book_id', 'title', 'author', 'date_published', 'isbn', 'genre', 'language', 'summary', 'bookRating', 'borrowedUntil', 'pages', 'reviewCount', 'timesBorrowed', 'borrowedByUser', 'dateReturned'].includes(sort) ? sort : 'book_id';
  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT 
      b.book_id as bookId,
      b.title,
      b.author,
      DATE_FORMAT(b.date_published, "%Y-%m-%d") as datePublished,
      b.isbn,
      b.is_deleted as isDeleted,
      g.genre,
      a.age_recommendation as ageRecommendation,
      l.language,
      b.pages,
      b.summary,
      b.is_borrowed as isBorrowed,
      b.front_cover as frontCover,
      rv.review_count as reviewCount,
      rv.bookRating,
      rc.borrowedUntil,
      rc.dateReturned,
      rc.borrowedByUser,
      rc2.timesBorrowed
    FROM books b
    LEFT JOIN (SELECT count(record_id) as timesBorrowed, user_id as borrowedByUser, book_id, date_returned as dateReturned, date_to_return as borrowedUntil
                FROM records
                GROUP BY record_id
                HAVING date_returned is Null) as rc using (book_id)
    LEFT JOIN (SELECT count(book_id) as review_count, AVG(rating) as bookRating, book_id
                FROM reviews
                WHERE is_deleted = 0
                GROUP BY book_id) as rv using (book_id)
    LEFT JOIN (SELECT book_id, count(record_id) as timesBorrowed
                FROM records
                GROUP BY book_id) as rc2 using (book_id)
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE ${role === rolesEnum.basic ? ' b.is_deleted = 0 AND' : ''} ${searchColumn} Like '%${search}%'
    ORDER BY ${sortColumn} ${direction} 
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [+pageSize, +offset]);
};
// OK
const getBy = async (column, value) => {
  const sql = `
    SELECT 
      b.book_id as bookId,
      b.title,
      b.author,
      DATE_FORMAT(b.date_published, "%Y-%m-%d") as datePublished,
      b.isbn,
      b.is_deleted as isDeleted,
      g.genre,
      a.age_recommendation as ageRecommendation,
      l.language,
      b.summary,
      rv.bookRating,
      rv.review_count as reviewCount,
      b.pages,
      b.is_borrowed as isBorrowed,
      b.front_cover as frontCover,
      rc.dateReturned,
      rc.borrowedByUser,
      rc.borrowedUntil
    FROM books b
    LEFT JOIN (SELECT count(book_id) as review_count, AVG(rating) as bookRating, book_id
                FROM reviews
                WHERE is_deleted = 0
                GROUP BY book_id) as rv using (book_id)
    LEFT JOIN (SELECT user_id as borrowedByUser, book_id, date_returned as dateReturned, date_to_return as borrowedUntil
                FROM records
                GROUP BY record_id
                HAVING date_returned is Null) as rc using (book_id)
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE ${column} = ? AND b.is_deleted = 0;
  `;

  const result = await db.query(sql, [value]);
  return result[0];
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
    book.datePublished || null,
    book.isbn,
    +book.isDeleted || 0,
    +book.genre || null,
    +book.ageRecommendation || null,
    +book.language || null,
    book.summary || null,
  ]);

  return getBy('book_id', result.insertId);
};

const update = async (updatedBook) => {
  console.log(updatedBook);
  const sql = `
        UPDATE books
        SET
          title = ?,
          author = ?,
          date_published = ?,
          isbn = ?,
          is_deleted = ?,
          genre_id = (SELECT genre_id FROM genres WHERE genre = ?),
          age_recommendation_id = (SELECT age_recommendation_id FROM age_recommendation WHERE age_recommendation = ?),
          language_id = (SELECT language_id FROM language WHERE language = ?),
          summary = ?
        WHERE book_id = ?
    `;

  const _ = await db.query(sql, [
    updatedBook.title,
    updatedBook.author,
    updatedBook.datePublished,
    updatedBook.isbn,
    +updatedBook.isDeleted,
    updatedBook.genre,
    updatedBook.ageRecommendation,
    updatedBook.language,
    updatedBook.summary,
    +updatedBook.bookId,
  ]);

  return getBy('book_id', updatedBook.bookId);
};
// OK
const remove = async (bookToDelete) => {
  const sql = `
        UPDATE books 
        SET is_deleted = true
        WHERE book_id = ?
    `;

  return db.query(sql, [bookToDelete.bookId]);
};

const coverChange = (path, bookId) => {
  const sql = `
    UPDATE books SET
      front_cover = ?
    WHERE book_id = ?
  `;

  return db.query(sql, [path, bookId]);
};

export default {
  create,
  getAllBooks,
  update,
  remove,
  getBy,
  coverChange,
};

// export const updateBook = (id, isBorrowed) => {
//   // 1. Check if book is available in the DB
//   // 2. Update isBorrowed value in the DB
//   // 3. Write a record in records
// };
