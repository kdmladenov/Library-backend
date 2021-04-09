import mariadb from 'mariadb';
import { DB_CONFIG } from '../../../config.js';

const db = mariadb.createPool(DB_CONFIG);

export default db;


// const pool = mariadb.createPool({
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'root',
//   database: 'library',
//   // connectionLimit: '5',
// });


