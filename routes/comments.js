// routes/comments.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// Rutas generales de comentarios
router.get('/', commentsController.getAllComments);                     // Obtener todos los comentarios
router.post('/', commentsController.addComment);                        // Crear un comentario
router.delete('/:id', commentsController.deleteComment);                // Eliminar un comentario por ID

// Rutas específicas
router.get('/post/:postId', commentsController.getCommentsByPostId);    // Obtener comentarios de un post
router.get('/user/:user', commentsController.getCommentsByUser);        // Obtener comentarios de un usuario

module.exports = router;
