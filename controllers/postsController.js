// controllers/postsController.js
const db = require('../config/db');

// Obtener todos los posts
exports.getAllPosts = (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
};

// Crear un nuevo post
exports.createPost = (req, res) => {
  const { titulo, descripcion, imagen } = req.body;
  const sql = 'INSERT INTO posts (titulo, descripcion, imagen) VALUES (?, ?, ?)';
  db.query(sql, [titulo, descripcion, imagen], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id: result.insertId, ...req.body });
    }
  });
};

// Obtener un post por su ID
exports.getPostById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(result[0]);
    }
  });
};

// Actualizar un post
exports.updatePost = (req, res) => {
  const id = req.params.id;
  const { titulo, descripcion, imagen } = req.body;
  const sql = 'UPDATE posts SET titulo = ?, descripcion = ?, imagen = ? WHERE id = ?';
  db.query(sql, [titulo, descripcion, imagen, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Post actualizado' });
    }
  });
};

// Eliminar un post
exports.deletePost = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Post eliminado' });
    }
  });
};
