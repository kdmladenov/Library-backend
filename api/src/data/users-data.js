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
      g.gender
      u.birth_date,
      u.email,
      u.phone,
      u.reading_points
    FROM users
    JOIN gender g USING (gender_id)
    WHERE ${column} = ?
  `;

  const result = await db.pool.query(sql, value);

  return result[0];
};

const create = async (user) => {
  const sql = `
    INSERT INTO library.users(
      username, -- 1
      password, -- 2
      first_name, -- 3
      last_name, -- 4
      gender -- 5
      birth_date, -- 6
      email, -- 7
      phone, -- 8
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.query(sql, [
    user.username, // 1
    user.password, // 2
    user.firstName, // 3
    user.lastName, // 4
    user.gender, // 5
    user.birthDate, // 6
    user.email, // 7
    user.phone, // 8
  ]);

  return getBy('user_id', result.insertId);
};

export default {
  create,
  getBy,
};
