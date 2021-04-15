import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';

// OK
const getBy = async (column, value, userId, role) => {
  const sql = `
  SELECT 
    rl.user_id as userId,
    u.username as username,
    r.review_id as reviewId,
    ra.reaction_id as reactionId,
    ra.reaction_name as reactionName
  FROM review_likes rl
  LEFT JOIN users u USING(user_id)
  LEFT JOIN reactions ra USING(reaction_id)
  LEFT JOIN reviews r USING(review_id)
  WHERE ${column} = ? ${role === rolesEnum.basic ? 'AND rl.is_deleted = 0 AND rl.user_id = ?' : ''};
  `;

  const result = await db.query(sql, [value, userId]);

  return result[0];
};

// Create - OK
const create = async (reactionId, reviewId, userId, role) => {
  const sql = `
    INSERT INTO review_likes (
      reaction_id,
      review_id,
      user_id
    )
    VALUES (?, ?, ?)
  `;
  const _ = await db.query(sql, [reactionId, reviewId, userId]);

  return getBy('review_id', reviewId, userId, role);
};

const update = async (reactionId, reviewId, userId, role) => {
  const sql = `
        UPDATE review_likes 
        SET reaction_id  = ?
        WHERE review_id = ? AND user_id = ?
    `;

  const _ = await db.query(sql, [reactionId, reviewId, userId]);

  return getBy('review_id', reviewId, userId, role);
};

const remove = async (reviewId, userId) => {
  const sql = `
        UPDATE review_likes 
        SET is_deleted  = 1
        WHERE review_id = ? AND user_id = ?
    `;

  const _ = db.query(sql, [reviewId, userId]);

  return db.query(sql, [reviewId, userId]);
};

export default {
  create,
  update,
  getBy,
  remove,
};
