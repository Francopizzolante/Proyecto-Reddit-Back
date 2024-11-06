// routes/posts.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Definir las rutas para las operaciones CRUD
router.get('/', postsController.getAllPosts);       // Obtener todos los posts
router.post('/', postsController.createPost);       // Crear un nuevo post
router.get('/:id', postsController.getPostById);    // Obtener un post por su ID
router.put('/:id', postsController.updatePost);     // Actualizar un post por su ID
router.delete('/:id', postsController.deletePost);  // Eliminar un post por su ID

module.exports = router;