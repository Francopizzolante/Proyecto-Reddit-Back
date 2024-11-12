// routes/posts.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// Definir las rutas para las operaciones CRUD
router.get('/', postsController.getAllPosts);                           // Obtener todos los posts
router.post('/', postsController.createPost);                           // Crear un nuevo post
router.get('/:id', postsController.getPostById);                        // Obtener un post por su ID
router.delete('/:id', postsController.deletePost);                      // Eliminar un post por su ID
router.post('/:id/like', postsController.addLikeToPost);                // Da like a un post
router.delete('/:id/like', postsController.removeLikeFromPost);         // Quita el like de un post 
router.get('/user/:user', postsController.getPostsByUser);              // obtener posts creados por un usuario
router.get('/user/:user/liked', postsController.getPostsLikedByUser);   // obtener posts likeados por un usuario


module.exports = router;
