// server.js
const express = require('express');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const app = express();

// Middleware
app.use(bodyParser.json());

// Usar las rutas
app.use('/api/posts', postsRoutes);

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
