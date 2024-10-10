const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta simple de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

// Configurar el puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);  
});
