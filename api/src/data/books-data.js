import db from './pool.js';
// OK
const getAllBooks = async (search, searchBy, sort, order, pageSize, offset) => {
  // const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'asc';
  // const direction = (order === 'desc') ? 'DESC' : 'ASC';
  // SORT NOT WORKING with ??

  const sql = `
    SELECT 
      b.book_id as bookId,
      b.title,
      b.author,
      b.date_published as datePublished,
      b.isbn,
      b.is_deleted as isDeleted,
      g.genre,
      a.age_recommendation as ageRecommendation,
      l.language,
      b.summary
    FROM books b
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE is_deleted = 0 AND ${searchBy} Like '%${search}%'
    ORDER BY ${sort} ${order} 
    LIMIT ? OFFSET ?
  `;

  // console.log(search, searchBy, sort, order, pageSize, offset);
  return db.query(sql, [
    +pageSize,
    +offset,
  ]);
};
// OK
const getBy = async (column, value) => {
  const sql = `
    SELECT 
      b.book_id as bookId,
      b.title,
      b.author,
      b.date_published as datePublished,
      b.isbn,
      b.is_deleted as isDeleted,
      g.genre,
      a.age_recommendation as ageRecommendation,
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

// Not finished
// const update = async (updated) => {
//   const {
//     title,
//     author,
//     date_published,
//     isbn,
//     is_deleted,
//     genre_id,
//     age_recommendation_id,
//     language_id,
//     summary,
//     id,
//   } = updated;

//   const sql = `
//         UPDATE books
//         SET
//           title = ?,
//           author = ?,
//           date_published = ?,
//           isbn = ?,
//           is_deleted = ?,
//           genre_id = ?,
//           age_recommendation_id = ?,
//           language_id = ?,
//           summary = ?
//         WHERE id = ?
//     `;

//   return db.query(sql, [
//     title,
//     author,
//     date_published,
//     isbn,
//     is_deleted,
//     genre_id,
//     age_recommendation_id,
//     language_id,
//     summary,
//     id,
//   ]);
// };

// OK
const remove = async (bookToDelete) => {
  const sql = `
        UPDATE books 
        SET is_deleted = true
        WHERE book_id = ?
    `;

  return db.query(sql, [bookToDelete.bookId]);
};

export default {
  create,
  getAllBooks,
  // update,
  remove,
  getBy,

};

// export const updateBook = (id, isBorrowed) => {
//   // 1. Check if book is available in the DB
//   // 2. Update isBorrowed value in the DB
//   // 3. Write a record in records
// };
