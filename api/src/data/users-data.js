import rolesEnum from '../common/roles.enum.js';
import db from './pool.js';

const getBy = async (column, value, isProfileOwner, role) => {
  const sql = `
    SELECT 
      u.user_id as userId, 
      u.username as username,
      u.first_name as firstName,
      r.type as role,
      u.reading_points as readingPoints,
      u.avatar
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

const getTimeline = async (userId) => {
  const sql = `
    SELECT
      concat('recordId_', record_id, ' bookId_', book_id) as id,
      "read" as event,
      b.book_id as bookId,
      b.title as title,
      b.author as author,
      b.front_cover as front_cover,
      r.bookRating as bookRating,
      DATE_FORMAT(rc.date_to_return, "%Y-%m-%d")  as dateToReturn,
      DATE_FORMAT(rc.date_returned, "%Y-%m-%d")  as date,
      DATE_FORMAT(rc.date_borrowed, "%Y-%m-%d")  as dateBorrowed,
      DATEDIFF(rc.date_returned, rc.date_to_return) as overdue,
      rc.user_id as userId,
      b.is_deleted as isDeleted,
      NULL as banDescription,
      NULL as banDuration
    FROM records rc 
    LEFT JOIN books b USING (book_id)
    LEFT JOIN (SELECT AVG(rating) as bookRating, book_id, is_deleted
              FROM reviews
              GROUP BY book_id
              HAVING is_deleted = 0) as r USING (book_id)
    WHERE user_id = ${userId}
    UNION 
    SELECT
      concat('reviewId_', review_id, ' bookId_', book_id) as id,
      "review" as event,
      b.book_id as bookId,      
      b.title as title,
      b.author as author,
      b.front_cover as front_cover,
      NULL as bookRating,
      NULL as dateToReturn,
      r.date_created as date,
      NULL as dateBorrowed,
      NULL as overdue,
      r.user_id as userId,
      r.is_deleted as isDeleted,
      NULL as banDescription,
      NULL as banDuration
    FROM reviews r
    LEFT JOIN books b USING (book_id)
    WHERE user_id = ${userId}
    UNION
    SELECT
      concat('ban_id', ban_id) as id,
      "ban" as event,
      NULL as bookId,      
      NULL as title,
      NULL as author,
      NULL as front_cover,
      NULL as reviewContent,
      NULL as dateToReturn,
      DATE_FORMAT(ban_date, "%Y-%m-%d") as date,
      NULL as dateBorrowed,
      NULL as overdue,
      user_id as userId,
      NULL as isDeleted,
      description as banDescription,
      DATEDIFF(exp_date, ban_date) as banDuration
    FROM ban_status
    WHERE user_id = ${userId}
    UNION
    SELECT
    concat('readingPoints_', reading_points) as id, 
      "registration" as event,
      NULL as bookId,      
      NULL as title,
      NULL as author,
      NULL as front_cover,
      NULL as reviewContent,
      NULL as dateToReturn,
      DATE_FORMAT(register_date, "%Y-%m-%d") as date,
      NULL as dateBorrowed,
      NULL as overdue,
      user_id as userId,
      NULL as isDeleted,
      NULL as banDescription,
      NULL as banDuration
    FROM users
    WHERE user_id = ${userId}
    ORDER BY date desc
  `;

  return db.query(sql, []);
};

const getAll = async (search, searchBy, sort, order, page, pageSize, role) => {
  const direction = ['ASC', 'asc', 'DESC', 'desc'].includes(order) ? order : 'asc';
  const searchColumn = [
    'user_id', 'username', 'first_name', 'reading_points', 'last_name', 'gender', 'email', 'last_name'].includes(searchBy) ? searchBy : 'title';
  const offset = page ? (page - 1) * pageSize : 0;

  const sql = `
    SELECT 
      u.avatar,
      u.user_id as userId, 
      u.username as username,
      u.first_name as firstName,      
      r.type as role,
      u.reading_points as readingPoints,
      u.last_name as lastName,
      g.gender as gender,
      DATE_FORMAT(u.birth_date, "%Y-%m-%d") as birthDate,
      u.email as email,
      u.phone as phone
    FROM users u
    LEFT JOIN gender g USING (gender_id)
    LEFT JOIN roles r USING(role_id)
    LIMIT ? OFFSET ?
  `;

  return db.query(sql, [pageSize, offset]);
};

const create = async (user) => {
  const sql = `
    INSERT INTO users (
      username, 
      password, 
      email, 
      role_id
    )
    VALUES (?, ?, ?, (SELECT role_id FROM roles WHERE type = ?))
  `;

  const result = await db.query(sql, [
    user.username,
    user.password,
    user.email,
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
      is_deleted = 1,
      username = 'DELETED USER',
      email = 'DELETED USER EMAIL'
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

const getAvatar = async (userId) => {
  const sql = `
    SELECT avatar, username
    FROM users
    WHERE user_id = ${userId}
  `;

  const result = await db.query(sql, []);
  return result[0];
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
  getTimeline,
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
  getAvatar,
  updatePoints,
};
