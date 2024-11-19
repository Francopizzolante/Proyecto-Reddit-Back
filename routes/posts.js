// routes/posts.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const postsController = require('../controllers/postsController');

// Rutas generales para posts
router.get('/', postsController.getAllPosts);                                   // Obtener todos los posts
router.post('/', upload.single('imagen'), postsController.createPost);          // Crear un nuevo post
router.delete('/:id', postsController.deletePost);                              // Eliminar un post por su ID

// Rutas relacionadas con likes
router.post('/:id/like', postsController.addLikeToPost);                        // Dar like a un post
router.delete('/:id/like', postsController.removeLikeFromPost);                 // Quitar like de un post

// Rutas relacionadas con usuarios
router.get('/user/:user', postsController.getPostsByUser);                      // Obtener posts creados por un usuario
router.get('/user/:user/liked', postsController.getPostsLikedByUser);           // Obtener posts likeados por un usuario

// Rutas específicas
router.get('/title/:id', postsController.getPostTitleById);                     // Obtener el título de un post por su ID

module.exports = router;
