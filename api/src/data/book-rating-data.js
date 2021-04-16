import db from './pool.js';

// OK
const getBy = async (userId, bookId) => {
  const sql = `
  SELECT 
      br.book_rating_id as ratingId,
      br.rating,
      b.title,
      b.author,
      b.book_id as bookId,
      b.isbn,
      u.user_id as userId,
      u.email,
      u.username,
      u.first_name as firstName,
      u.last_name as lastName
  FROM book_ratings br
  JOIN books b USING(book_id)
  LEFT JOIN genres g USING (genre_id)
  LEFT JOIN age_recommendation a USING (age_recommendation_id)
  LEFT JOIN language l USING (language_id)
  LEFT JOIN users u USING (user_id)
  WHERE br.user_id = ? AND br.book_id = ? AND br.is_deleted = 0 AND b.is_deleted = 0;
  `;

  const result = await db.query(sql, [+userId, +bookId]);
  return result[0];
};

// Create - OK
const create = async (rating, userId, bookId) => {
  const sql = `
    INSERT INTO book_ratings (
      user_id,
      book_id,
      rating
    )
    VALUES (?, ?, ?)
  `;
  const _ = await db.query(sql, [+userId, +bookId, +rating]);

  return getBy(+userId, +bookId);
};

const update = async (rating, userId, bookId) => {
  const sql = `
        UPDATE book_ratings 
        SET rating  = ?
        WHERE user_id = ? AND book_id = ?
    `;

  const _ = db.query(sql, [rating, userId, bookId]);
  return getBy(+userId, +bookId);
};

export default {
  create,
  update,
  getBy,
};
