import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';

// OK
const getBy = async (column, value, userId, role) => {
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
  WHERE ${column} = ? ${role === rolesEnum.basic ? 'AND r.is_deleted = 0 AND user_id = ?' : ''};
  `;

  const result = await db.query(sql, [value, userId]);
  return result[0];
};

// Create - OK
const create = async (reactionId, reviewId, userId) => {
  const sql = `
    INSERT INTO review_likes (
      reaction_id
      review_id,
      user_id,
    )
    VALUES (?, ?, ?)
  `;
  const _ = await db.query(sql, [reactionId, reviewId, userId]);
  return getBy('r.review_id', reviewId);
};

const update = async (reactionId, reviewId, userId) => {
  const sql = `
        UPDATE review_likes 
        SET reaction_id  = ?
        WHERE review_id = ? AND user_id = ?
    `;

  const _ = db.query(sql, [reactionId, reviewId, userId]);
  return getBy('r.review_id', reviewId);
};

export default {
  create,
  update,
  getBy,
};
