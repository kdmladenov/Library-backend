import db from './pool.js';

// eslint-disable-next-line import/prefer-default-export
export const tokenExists = async (token) => {
  const sql = `
    SELECT *
    FROM tokens
    WHERE token = ?
  `;

  const result = await db.query(sql, [token]);

  return result && result.length > 0;
};
