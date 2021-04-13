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

const getBy = async (column, value) => {
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
    WHERE r.is_deleted = 0 AND ${column} = ?
  `;
  const result = await db.query(sql, [value]);

  return result[0];
};

const create = async (content, userId, bookId) => {
  const sql = `
    INSERT INTO reviews (
      content,
      book_id,
      user_id,
    )
    VALUES (?, ?, ?)
  `;

  const result = db.query(sql, [
    content,
    bookId,
    userId,
  ]);

  return getBy('review_id', result.insertId);
};

const update = async (content, reviewId) => {
  const sql = `
    UPDATE reviews SET
      content = ?,
      date_edited = CURRENT_TIMESTAMP()
    WHERE review_id = ?
  `;
  return db.query(sql, [content, reviewId]);
};

const remove = async (reviewId) => {
  const sql = `
  UPDATE reviews SET
    is_deleted = true
  WHERE review_id = ?
  `;
  return db.query(sql, [reviewId]);
};

export default {
  getAll,
  getBy,
  create,
  update,
  remove,
};
