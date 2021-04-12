import db from './pool.js';

const getBy = async (column, value) => {
  const sql = `
    SELECT 
      u.user_id, 
      u.username,
      u.first_name,
      u.last_name,
      g.gender,
      DATE_FORMAT(u.birth_date, "%m/%d/%Y") as birth_date,
      u.email,
      u.phone,
      u.reading_points,
      b.is_banned,
      b.banned_date,
      b.exp_date as bann_exp_date,
      b.description as bann_description
    FROM users u
    LEFT JOIN gender g USING (gender_id)
    LEFT JOIN bann_status b USING (user_id)
    WHERE u.is_deleted = 0 AND ${column} = ?
  `;

  const result = await db.query(sql, value);

  return result[0];
};

const create = async (user) => {
  const sql = `
    INSERT INTO users (
      username, 
      password, 
      first_name, 
      last_name, 
      gender_id, 
      birth_date, 
      email, 
      phone,
      role_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, (SELECT role_id FROM roles WHERE type = ?))
  `;

  const result = await db.query(sql, [
    user.username,
    user.password,
    user.firstName || null,
    user.lastName || null,
    user.gender || null,
    user.birthDate,
    user.email,
    user.phone || null,
    user.role,
  ]);

  return getBy('user_id', result.insertId);
};

const update = async (user) => {
  
  const sql = `
    UPDATE users SET 
      password = ?, 
      first_name = ?, 
      last_name = ?, 
      gender_id = ?, 
      birth_date = ?, 
      email = ?, 
      phone = ?,
    WHERE user_id = ?
  `;

  return db.query(sql, [
    user.password,
    user.firstName,
    user.lastName,
    user.gender,
    user.birthDate,
    user.email,
    user.phone,
    user.userId,
  ]);
};

const remove = async userId => {
  const sql = `
    UPDATE users SET
      is_deleted = 1
    WHERE user_id = ?
  `;

  return db.query(sql, [userId]);
};

export default {
  getBy,
  create,
  update,
  remove,
};
