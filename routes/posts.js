// routes/posts.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // Asegúrate de importar correctamente 'upload'
const postsController = require('../controllers/postsController');

// Definir las rutas para las operaciones CRUD
router.get('/', postsController.getAllPosts);                           // Obtener todos los posts
// Ruta para crear un nuevo post
router.post('/create', upload.single('imagen'), async (req, res) => {
    try {
        const { titulo, descripcion, user } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const nuevoPost = await postsController.createPost({ titulo, descripcion, user, imagen });
        res.status(201).json(nuevoPost);
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ error: 'Error al crear el post' });
    }
});
router.get('/:id', postsController.getPostById);                        // Obtener un post por su ID
router.delete('/:id', postsController.deletePost);                      // Eliminar un post por su ID
router.post('/:id/like', postsController.addLikeToPost);                // Da like a un post
router.delete('/:id/like', postsController.removeLikeFromPost);         // Quita el like de un post 
router.get('/user/:user', postsController.getPostsByUser);              // obtener posts creados por un usuario
router.get('/user/:user/liked', postsController.getPostsLikedByUser);   // obtener posts likeados por un usuario
router.get('/title/:id', postsController.getPostTitleById);             // Obtener el título de un post por su ID

module.exports = router;
