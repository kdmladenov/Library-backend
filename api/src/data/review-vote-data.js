import db from './pool.js';

// OK
const getBy = async (column, value) => {
  const sql = `

  SELECT 
    rl.user_id as userId,
    r.review_id as reviewId,
    ra.reaction_id as reactionId,
    ra.reaction_name as reactionName
  FROM review_likes rl
  LEFT JOIN users u USING(user_id)
  LEFT JOIN reactions ra USING(reaction_id)
  LEFT JOIN reviews r USING(review_id)
  WHERE review_id = ?;
  `;

  const result = await db.query(sql, [value]);
  return result[0];
};

// Create - OK
const create = async (reviewId, userId, reactionId) => {
  const sql = `
    INSERT INTO review_likes (
      review_id,
      user_id,
      reaction_id
    )
    VALUES (?, ?, ?)
  `;
  const _ = await db.query(sql, [
    +reviewId, +userId, +reactionId,
  ]);
  return getBy('r.review_id', reviewId);
};

const update = async (reviewId, userId, reactionId) => {
  const sql = `
        UPDATE review_likes 
        SET reaction_id  = ?
        WHERE user_id = ? AND review_id = ?
    `;

  const _ = db.query(sql, [reactionId, userId, reviewId]);
  return getBy('r.review_id', reviewId);
};

export default {
  create,
  update,
  getBy,
};
