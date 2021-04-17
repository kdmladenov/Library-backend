import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';

const getBy = async (column, value, isProfileOwner, role) => {
  const sql = `
    SELECT 
      u.user_id as userId, 
      u.username as username,
      u.first_name as firstName,
      r.type as role,
      u.reading_points as readingPoints
      ${role === rolesEnum.admin || isProfileOwner ? `, u.last_name as lastName,
      g.gender as gender,
      DATE_FORMAT(u.birth_date, "%Y-%m-%d") as birthDate,
      u.email as email,
      u.phone as phone,
      b.ban_date as banDate,
      b.exp_date as banExpDate,
      b.description as banDescription` : ''}
    FROM users u
    LEFT JOIN gender g USING (gender_id)
    LEFT JOIN ban_status b USING (user_id)
    LEFT JOIN roles r USING(role_id)
    WHERE ${role === rolesEnum.admin ? `` : `u.is_deleted = 0 AND`} ${column} = ?
  `;

  const result = await db.query(sql, value);

  return result[0];
};

const getAll = async (search, searchBy, sort, order, page, pageSize, role) => {
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'asc';
  const searchColumn = [
    'user_id', 'username', 'first_name', 'reading_points', 'last_name', 'gender', 'email', 'last_name'].includes(searchBy) ? searchBy : 'title';
  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT 
      u.user_id as userId, 
      u.username as username,
      u.first_name as firstName,      
      r.type as role,
      u.reading_points as readingPoints
      ${role === rolesEnum.admin ? `, u.last_name as lastName,
      g.gender as gender,
      DATE_FORMAT(u.birth_date, "%Y-%m-%d") as birthDate,
      u.email as email,
      u.phone as phone,
      b.ban_date as banDate,
      b.exp_date as banExpDate,
      b.description as banDescription` : ''}
    FROM users u
    LEFT JOIN gender g USING (gender_id)
    LEFT JOIN ban_status b USING (user_id)
    LEFT JOIN roles r USING(role_id)
    WHERE ${role === rolesEnum.admin ? `` : `u.is_deleted = 0 AND`} ${searchColumn} Like '%${search}%'
    ORDER BY ? ${direction} 
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [sort, pageSize, offset]);
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
    user.firstName,
    user.lastName,
    user.gender,
    user.birthDate,
    user.email,
    user.phone,
    user.role,
  ]);

  return getBy('user_id', result.insertId, true);
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
      gender_id = (SELECT gender_id FROM gender WHERE gender = ?), 
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
    WHERE u.is_deleted = 0 AND username = ?
  `;

  const result = await db.query(sql, [username]);
  return result[0];
};

const ban = async (userId, duration, description) => {
  const sql = `
    INSERT INTO ban_status (
      user_id,
      ban_date,
      exp_date,
      description
    )
    VALUES(?, CURRENT_TIMESTAMP(), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? DAY), ?)
  `;

  return db.query(sql, [userId, duration, description]);
};

const getBanRecordsByUserId = async (userId) => {
  const sql = `
    SELECT * FROM ban_status
    WHERE user_id = ?
    ORDER BY exp_date DESC      
  `;

  const result = await db.query(sql, [userId]);

  return result;
};
// tokens table includes blacklisted tokens only
const logoutUser = async (token) => {
  const sql = `
    INSERT INTO tokens (
      token
    )
    VALUES( ? )
  `;
  return db.query(sql, [token]);
};

const avatarChange = (userId, path) => {
  const sql = `
    UPDATE users SET
      avatar = ?
    WHERE user_id = ?
  `;

  return db.query(sql, [path, userId]);
};

const updatePoints = async (userId, points) => {
  const sql = `
    UPDATE users SET
      reading_points = reading_points + ?
    WHERE user_id = ?
  `;

  return db.query(sql, [points, userId]);
};

export default {
  getBy,
  getAll,
  create,
  getPasswordBy,
  updatePassword,
  updateData,
  remove,
  loginUser,
  ban,
  getBanRecordsByUserId,
  logoutUser,
  avatarChange,
  updatePoints,
};
