const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Probar la conexión al iniciar la aplicación
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } 
  else {
    console.log('Conexión a la base de datos exitosa');
    connection.release();                                   // Libera la conexión una vez que se prueba
  }
});

module.exports = pool.promise();
