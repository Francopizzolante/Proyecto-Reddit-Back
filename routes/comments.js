// routes/comments.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// Definir las rutas para las operaciones CRUD
router.get('/', commentsController.getAllComments);                     // Obtener todos los Comments
router.post('/', commentsController.addComment);                        // Añade un commentario
router.delete('/:id', commentsController.deleteComment);                // Elimina un comentario
router.get('/post/:postId', commentsController.getCommentsByPostId);    // Obtiene los comentarios de un post
router.get('/user/:user', commentsController.getCommentsByUser);        // Obtiene los comentarios de un usuario


module.exports = router;
