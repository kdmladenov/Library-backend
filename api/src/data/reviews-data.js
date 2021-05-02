import rolesEnum from "../common/roles.enum.js";
import db from "./pool.js";

const getAll = async (bookId, order, page, pageSize) => {
  const direction = ["ASC", "asc", "DESC", "desc"].includes(order)
    ? order
    : "ASC";
  const offset = (page - 1) * pageSize;

  const sql = `
    SELECT
    r.review_id as reviewId,
    r.rating,
    r.content as content, 
    r.date_created as dateCreated,
    r.date_edited as dateEdited,
    r.title as title,
    u.user_id as userId,
    u.avatar as avatar,
    u.username as username,
    b.book_id as bookId,
    b.title as bookTitle,
    rl.thumbs_up as thumbsUp,
    rl.thumbs_down as thumbsDown,
    b.author as bookAuthor
    FROM reviews r
    LEFT JOIN users u USING (user_id)
    LEFT JOIN books b USING (book_id)
    LEFT JOIN (select review_id, 
        count(if(reaction_id=1,1,null)) as thumbs_up, 
        count(if(reaction_id=2,1,null)) as thumbs_down
        from review_likes
        group by review_id) rl USING (review_id)
    WHERE r.is_deleted = 0 AND b.book_id = ?
    ORDER BY r.date_created ${direction}
    LIMIT ? OFFSET ?
    `;
  // paging and sorting !!! Why the ? placeholders are not working !!!!
  return db.query(sql, [+bookId, pageSize, offset]);
};

const getBy = async (column, value, userId, role) => {
  const sql = `
  SELECT
  r.review_id as reviewId,
  r.rating,
  r.content as content, 
  r.date_created as dateCreated,
  r.date_edited as dateEdited,
  r.title as title,
  u.user_id as userId,
  u.avatar as avatar,
  u.username as username,
  b.book_id as bookId,
  b.title as bookTitle,
  rl.thumbs_up as thumbsUp,
  rl.thumbs_down as thumbsDown,
  b.author as bookAuthor
  FROM reviews r
  LEFT JOIN users u USING (user_id)
  LEFT JOIN books b USING (book_id)
  LEFT JOIN (select review_id, 
      count(if(reaction_id=1,1,null)) as thumbs_up, 
      count(if(reaction_id=2,1,null)) as thumbs_down
      from review_likes
      group by review_id) rl USING (review_id)
  WHERE ${column} = ? ${
    role === rolesEnum.basic ? "AND r.is_deleted = 0 AND user_id = ?" : ""
  }
  `;
  const result = await db.query(sql, [value, userId]);

  return result[0];
};

const create = async (content, userId, bookId, rating, title) => {
  const sql = `
    INSERT INTO reviews (
      content,
      user_id,
      book_id,
      rating,
      title
    )
    VALUES (?, ?, ?, ?, ?)
  `;
  const result = await db.query(sql, [content, userId, bookId, rating, title]);

  return getBy("review_id", result.insertId);
};

const update = async (content, reviewId, userId, role, rating, title) => {
  const sql = `
    UPDATE reviews SET
      title = ?,
      content = ?,
      rating = ?,
      date_edited = CURRENT_TIMESTAMP()
    WHERE review_id = ? ${role === rolesEnum.basic ? "AND user_id = ?" : ""}
  `;
  return db.query(sql, [title, content, rating, reviewId, userId]);
};

const remove = async (reviewId, userId, role) => {
  const sql = `
    UPDATE reviews SET
      is_deleted = true
    WHERE review_id = ? ${role === rolesEnum.basic ? "AND user_id = ?" : ""}
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
