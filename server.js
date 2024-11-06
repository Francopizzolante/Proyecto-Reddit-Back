// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const postsRoutes = require('./routes/posts');
const likesRoutes = require('./routes/likes');
const commentsRoutes = require('./routes/comments');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Usar las rutas
app.use('/api/posts', postsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
