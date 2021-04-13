import db from './pool.js';

const getBy = async (column, value) => {
  const sql = `
    SELECT 
      u.user_id as userId, 
      u.username as username,
      u.first_name as firstName,
      u.last_name as lastName,
      g.gender as gender,
      DATE_FORMAT(u.birth_date, "%m/%d/%Y") as birthDate,
      u.email as email,
      u.phone as phone,
      u.reading_points as readingPoints,
      b.is_banned as isBanned,
      b.banned_date as bannDate,
      b.exp_date as bannExpDate,
      b.description as bannDescription
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

const getPasswordBy = async (column, value) => {
  const sql = `
    SELECT password
    FROM users
    WHERE ${column} = ?
  `;
  const result = await db.query(sql, [value]);
  return result[0];
};

const updatePassword = async (userId, password) => {
  const sql = `
  UPDATE users SET  
    password = ?
  WHERE user_id = ?
  `;

  return db.query(sql, [password, userId]);
};

const updateData = async (user) => {
  const sql = `
    UPDATE users SET
      first_name = ?, 
      last_name = ?, 
      gender_id = ?, 
      birth_date = ?, 
      email = ?, 
      phone = ?
    WHERE user_id = ?
  `;

  return db.query(sql, [
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

const loginUser = async username => {
  const sql = `
    SELECT 
      u.username as username, 
      u.password as password,
      u.user_id as userId,
      r.type as role
    FROM users u
    LEFT JOIN roles r USING (role_id)
    WHERE username = ?
  `;

  const result = await db.query(sql, [username]);
  return result[0];
};

export default {
  getBy,
  create,
  getPasswordBy,
  updatePassword,
  updateData,
  remove,
  loginUser,
};
