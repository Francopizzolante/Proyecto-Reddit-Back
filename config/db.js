// config/db.js
const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost', // Cambia si tu base de datos está en otro servidor
  user: 'root',      // Cambia al nombre de usuario de tu base de datos
  password: '1234567',      // Cambia la contraseña si es necesario
  database: 'reddit', // Cambia al nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.log('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = db;
