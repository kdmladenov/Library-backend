import db from './pool.js';

const getAll = async () => {

};

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
      u.reading_points
    FROM users u
    LEFT JOIN gender g USING (gender_id)
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

const remove = async userId => {
  const sql = `
    UPDATE users SET
      is_deleted = 1
    WHERE user_id = ?
  `;

  return db.query(sql, [userId]);
};

export default {
  create,
  getBy,
  remove,
};
