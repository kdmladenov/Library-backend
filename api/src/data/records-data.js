import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';
// Not started
const getAllRecords = async (search, searchBy, sort, order, pageSize, page, role) => {
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'asc';
  const searchColumn = [
    'book_id', 'title', 'author', 'date_published', 'isbn', 'genre', 'language', 'summary',
    'record_id', 'date_borrowed', 'bookRating', 'date_returned', 'date_to_return', 'user_id'].includes(searchBy) ? searchBy : 'title';
  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT 
      b.book_id as bookId,
      b.title,
      b.author,
      b.isbn,
      r.bookRating,
      g.genre,
      b.summary,
      DATE_FORMAT(b.date_published, "%Y-%d-%m")  as datePublished,
      DATE_FORMAT(rc.date_to_return, "%Y-%d-%m")  as dateExpectedToBeFree
      ${(role === rolesEnum.admin) ? `,
        DATE_FORMAT(rc.date_returned, "%Y-%d-%m")  as dateReturned,
        DATE_FORMAT(rc.date_borrowed, "%Y-%d-%m")  as dateBorrowed,
        rc.record_id as recordId,
        rc.user_id as userId,
        b.is_deleted as isDeleted ` : ''}
    FROM records rc 
    LEFT JOIN books b USING (book_id)
    LEFT JOIN genres g USING(genre_id)
    LEFT JOIN age_recommendation a USING(age_recommendation_id)
    LEFT JOIN language l USING(language_id)
    LEFT JOIN (SELECT AVG(rating) as bookRating, book_id, is_deleted
                    FROM book_ratings
                    GROUP BY book_id
                    HAVING is_deleted = 0) as r using (book_id)
    WHERE ${role === rolesEnum.basic ? 'b.is_deleted = 0 AND' : ''} ${searchColumn} Like '%${search}%'
    ORDER BY ? ${direction} 
    LIMIT ? OFFSET ?
  `;
  return db.query(sql, [sort, +pageSize, +offset]);
};

// OK no difference admin/basic
const getBorrowedBy = async (column, value) => {
  const sql = `
    SELECT 
    r.record_id as recordId,
    r.book_id as bookId,
    r.user_id as userId,
    b.title,
    b.author,
    b.isbn,
    g.genre,
    a.age_recommendation as ageRecommendation,
    l.language,
    b.summary,
    b.pages,
    rt.bookRating,      
    b.is_borrowed as isBorrowed,
    DATE_FORMAT(r.date_borrowed, "%Y-%d-%m") as dateBorrowed,
    DATE_FORMAT(r.date_returned, "%Y-%d-%m") as dateReturned,
    DATE_FORMAT(r.date_to_return, "%Y-%d-%m") as dateToReturn,
    DATE_FORMAT(b.date_published, "%Y-%d-%m") as datePublished,
    b.is_deleted as isDeleted
    FROM books b
    LEFT JOIN records r USING(${column})
    LEFT JOIN (SELECT AVG(rating) as bookRating, book_id, is_deleted
                FROM book_ratings
                GROUP BY book_id
                HAVING is_deleted = 0) as rt using (book_id)
    LEFT JOIN genres g USING (genre_id)
    LEFT JOIN age_recommendation a USING (age_recommendation_id)
    LEFT JOIN language l USING (language_id)
    WHERE ${column} = ${value} 
    AND date_returned IS NULL 
    AND b.is_deleted = 0
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
    DATE_FORMAT(date_borrowed, "%Y-%d-%m") as dateBorrowed,
    DATE_FORMAT(date_returned, "%Y-%d-%m") as dateReturned,
    DATE_FORMAT(date_to_return, "%Y-%d-%m") as dateToReturn
    FROM records
    WHERE user_id = ? AND book_id = ?
  `;

  const result = await db.query(sql, [userId, bookId]);
  return result[0];
};

export default {
  create,
  getAllRecords,
  remove,
  getBorrowedBy,
  getRecordByUserIdAndBookId,
};
