import db from './pool.js';

const tokenExists = async (token) => {
  const sql = `
    SELECT *
    FROM tokens
    WHERE token = ?
  `;

  const result = await db.query(sql, [token]);

  return result && result.length > 0;
};

export default tokenExists;
