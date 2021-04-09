import mariadb from 'mariadb';
import { DB_CONFIG } from '../../../config.js';

const pool = mariadb.createPool(DB_CONFIG);

export default pool;


// const pool = mariadb.createPool({
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'root',
//   database: 'library',
//   // connectionLimit: '5',
// });


