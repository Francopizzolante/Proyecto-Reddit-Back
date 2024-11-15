// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

// Servir archivos estáticos de la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar las rutas
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
