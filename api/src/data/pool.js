import mariadb from 'mariadb';

const db = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '0709',
  database: 'library',
  // connectionLimit: '5',
});

export default db;
