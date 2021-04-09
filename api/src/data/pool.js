import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'library',
  // connectionLimit: '5',
});

export default pool;
