import db from './pool.js';
// Not started
// const getAllRecords = async () => {

// };

// OK
const getBorrowedBy = async (column, value) => {
  const sql = `
    SELECT 
    r.user_id as userId,
    r.book_id as bookId,
    r.date_borrowed as dateBorrowed,
    r.date_returned as dateReturned,
    r.date_to_return as dateToReturn,
    b.title,
    b.author,
    b.date_published as datePublished,
    b.isbn,
    b.is_deleted as isDeleted,
    g.genre,
    a.age_recommendation as ageRecommendation,
    l.language,
    b.summary,
    b.pages,      
    b.is_borrowed as isBorrowed
    FROM books b
    LEFT JOIN records r USING(${column})
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE ${column} = ${value} 
    AND date_returned IS NULL 
    AND is_deleted = 0
    AND is_borrowed = 1;
  `;

  const result = await db.query(sql);
  return result[0];
};

// OK
const create = async (userId, bookId) => {
  const sql = `
    INSERT INTO records (
      book_id,
      user_id
    )
    VALUES ( ${bookId}, ${userId})
  `;
  const result = await db.query(sql);

  const sql2 = `
        UPDATE books 
        SET is_borrowed = true
        WHERE book_id = ${bookId}
    `;

  const _ = await db.query(sql2);

  return getBorrowedBy('book_id', bookId);
};

// OK
const remove = async (bookToReturn) => {
  const sql = `
        UPDATE records 
        SET date_returned = CURRENT_TIMESTAMP()
        WHERE book_id = ${bookToReturn.bookId}
    `;
  const _ = await db.query(sql);

  const sql2 = `
    UPDATE books 
    SET is_borrowed = false
    WHERE book_id = ${bookToReturn.bookId}
`;

  return db.query(sql2);
};

const getRecordByUserIdAndBookId = async (userId, bookId) => {
  const sql = `
    SELECT 
    user_id as userId,
    book_id as bookId,
    date_borrowed as dateBorrowed,
    date_returned as dateReturned,
    date_to_return as dateToReturn
    FROM records
    WHERE user_id = ? AND book_id = ?
  `;

  const result = await db.query(sql, [userId, bookId]);
  return result[0];
};

export default {
  create,
  // getAllRecords,
  remove,
  getBorrowedBy,
  getRecordByUserIdAndBookId,
};
