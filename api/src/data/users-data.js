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
      u.birth_date,
      u.email,
      u.phone,
      u.reading_points
    FROM users u
    JOIN gender g USING (gender_id)
    WHERE ${column} = ?
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
      phone
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.query(sql, [
    user.username,
    user.password,
    user.firstName || null,
    user.lastName || null,
    +user.gender || null,
    user.birthDate,
    user.email,
    user.phone || null,
  ]);

  return getBy('user_id', result.insertId);
};

export default {
  create,
  getBy,
};
