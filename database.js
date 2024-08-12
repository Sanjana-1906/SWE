const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '22071a66e5vnr',
  database: 'flashcards',
  connectionLimit: 10
});

module.exports = pool.promise();  // Use promise-based API for better async support
