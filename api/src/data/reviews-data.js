import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';

const getAll = async (bookId, order, page, pageSize) => {
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'ASC';
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT 
      r.review_id, 
      r.content,
      r.date_created,
      u.user_id,
      u.username,
      b.book_id,
      b.title,
      b.author  
    FROM reviews r
    LEFT JOIN users u USING (user_id)
    LEFT JOIN books b USING (book_id)
    WHERE r.is_deleted = 0 AND b.book_id = ?
    ORDER BY r.date_created ${direction}
    LIMIT ?, ?
  `;
  // paging and sorting !!! Why the ? placeholders are not working !!!!
  return db.query(sql, [+bookId, offset, pageSize]);
};

const getBy = async (column, value, userId, role) => {
  const sql = `
    SELECT
      r.review_id as reviewId,
      r.content as content, 
      r.date_created as dateCreated,
      u.user_id as userId,
      u.username as username,
      b.book_id as bookId,
      b.title as bookTitle,
      b.author as bookAuthor
    FROM reviews r
    LEFT JOIN users u USING (user_id)
    LEFT JOIN books b USING (book_id)
    WHERE ${column} = ? ${role === rolesEnum.basic ? 'AND r.is_deleted = 0 AND user_id = ?' : ''}
  `;
  const result = await db.query(sql, [value, userId]);

  return result[0];
};

const create = async (content, userId, bookId) => {
  const sql = `
    INSERT INTO reviews (
      content,
      user_id,
      book_id
    )
    VALUES (?, ?, ?)
  `;
  const result = await db.query(sql, [content, userId, bookId]);

  return getBy('review_id', result.insertId);
};

const update = async (content, reviewId, userId, role) => {
  const sql = `
    UPDATE reviews SET
      content = ?,
      date_edited = CURRENT_TIMESTAMP()
    WHERE review_id = ? ${role === rolesEnum.basic ? 'AND user_id = ?' : ''}
  `;
  return db.query(sql, [content, reviewId, userId]);
};

const remove = async (reviewId, userId, role) => {
  const sql = `
    UPDATE reviews SET
      is_deleted = true
    WHERE review_id = ? ${role === rolesEnum.basic ? 'AND user_id = ?' : ''}
  `;
  return db.query(sql, [reviewId, userId, role]);
};

const getByUserIdAndBookId = async (userId, bookId) => {
  const sql = `
    SELECT
      r.review_id as reviewId,
      r.content as content, 
      r.date_created as dateCreated,
      u.user_id as userId,
      u.username as username,
      b.book_id as bookId,
      b.title as bookTitle,
      b.author as bookAuthor
    FROM reviews r
    LEFT JOIN users u USING (user_id)
    LEFT JOIN books b USING (book_id)
    WHERE r.is_deleted = 0 AND u.user_id = ? AND b.book_id = ?
  `;
  const result = await db.query(sql, [userId, bookId]);

  return result[0];
};

export default {
  getAll,
  getBy,
  create,
  update,
  remove,
  getByUserIdAndBookId,
};
