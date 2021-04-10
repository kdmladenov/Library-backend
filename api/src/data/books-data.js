import db from './pool.js';

// const getAll = async () => {
//   const sql = `
//         SELECT id, name, age 
//         FROM books
//     `;

//   return await db.query(sql);
// }

const getBookBy = async (column, value) => {
  const sql = `
    SELECT *
    FROM books 
    WHERE ${column} = ?
  `;
  const result = await db.query(sql, value);
  return result[0];
};

// const getBy = async (column, value) => {
//   const sql = `
//     SELECT 
//       b.book_id,
//       b.title,
//       b.author,
//       b.date_published,
//       b.isbn,
//       b.is_deleted,
//       g.genre,
//       a.age_recommendation,
//       l.language,
//       b.summary
//     FROM books b
//     JOIN genres g USING (genre_id)
//     JOIN age_recommendation a USING (age_recommendation_id)
//     JOIN language l USING (language_id)
//     WHERE ${column} = ?
//   `;

//   const result = await db.query(sql, value);
//   return result[0];
// };

const create = async (book) => {
  const sql = `
    INSERT INTO books (
      title,
      author,
      date_published,
      isbn,
      is_deleted,
      genre_id,
      age_recommendation_id,
      language_id,
      summary
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await db.query(sql, [
    book.title,
    book.author,
    book.date_published || null,
    +book.isbn || null,
    +book.is_deleted || 0,
    +book.genre || null,
    +book.age_recommendation || null,
    +book.language || null,
    book.summary || null,
  ]);

  return getBookBy('book_id', result.insertId);
};















// const getBy = async (column, value) => {
//     const sql = `
//         SELECT id, name, age 
//         FROM people
//         WHERE ${column} = ?
//     `;  

//     const result = await db.query(sql, [value]);

//     return result[0];
// }

// const searchBy = async (column, value) => {
//     const sql = `
//         SELECT id, name, age 
//         FROM people
//         WHERE ${column} LIKE '%${value}%' 
//     `; 

//     return await db.query(sql);
// }

// const create = async (name, age) => {
//     const sql = `
//         INSERT INTO people(name, age)
//         VALUES (?, ?)
//     `;

//     const result = await db.query(sql, [name, age]);

//     return {
//         id: result.insertId,
//         name: name,
//         age: age
//     };
// }

// const update = async (person) => {
//     const { id, name, age } = person;
//     const sql = `
//         UPDATE people SET
//           name = ?,
//           age = ?
//         WHERE id = ?
//     `;

//     return await db.query(sql, [name, age, id]);
// }

// const remove = async (person) => {
//     const sql = `
//         DELETE FROM people 
//         WHERE id = ?
//     `;

//     return await db.query(sql, [person.id]);
// }

// export default {
// getAll,
// searchBy,
// getBy,
// create,
// update,
// remove
// }

// export const createBook = (req, res) => {
//   const book = {
//     ...req.body,
//     isBorrowed: false,
//     isDeleted: false,
//   };
//   books.push(book);
//   return book;
// };

// export const updateBook = (id, isBorrowed) => {
//   // 1. Check if book is available in the DB
//   // 2. Update isBorrowed value in the DB
//   // 3. Write a record in records
// };


export default {
  create,
  getBookBy,
  // getBy,
};