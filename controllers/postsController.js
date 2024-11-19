// controllers/postsController.js
const db = require('../config/db');

// Obtener todos los posts
exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts');
        res.json(rows);
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al obtener los posts', details: err.message });
    }
};

// Crear un nuevo post
exports.createPost = async (req, res) => {
    try {
        const { titulo, descripcion, user } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        // Ejecutar la consulta de inserción en la base de datos
        const [result] = await db.query(
            'INSERT INTO posts (titulo, descripcion, user, imagen) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, user, imagen]
        );

        res.status(201).json({ id: result.insertId, titulo, descripcion, user, imagen });               // Devolver el resultado del nuevo post creado

    } 
    catch (err) {
        console.error('Error al crear el post:', err);
        res.status(500).json({ error: 'Error al crear el post', details: err.message });                // Enviar respuesta con un error si algo falla
    }
};

// Obtener el título de un post por su ID
exports.getPostTitleById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT titulo FROM posts WHERE id = ?', [req.params.id]);        // Consulta a la base de datos
        res.json(rows[0] || { error: 'Post no encontrado' });                                           // Devuelve el título o un error si no se encuentra
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al obtener el título del post', details: err.message });
    }
};

// Eliminar un post
exports.deletePost = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Post eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al eliminar el post', details: err.message });
    }
};

// Dar like a un post
exports.addLikeToPost = async (req, res) => {
    const postId = parseInt(req.params.id);     // ID del post
    const user = req.body.user;                 // Usuario que da like (recibido como string)

    try {
        // Validar que el usuario no esté vacío
        if (!user || typeof user !== 'string' || user.trim() === '') {
            return res.status(400).json({ error: 'El usuario es obligatorio y debe ser un string válido.' });
        }

        // Obtén el campo likedBy del post
        const [rows] = await db.query('SELECT likedBy FROM posts WHERE id = ?', [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Obtener el campo likedBy como string
        let likedBy = rows[0].likedBy || '';

        // Convertir el string a un array de nombres separados por comas
        let likedByArray = likedBy.split(',').map(name => name.trim()).filter(Boolean);

        // Evitar duplicados
        if (!likedByArray.includes(user)) {
            likedByArray.push(user); // Agregar el usuario
        }

        // Convertir de nuevo a un string separado por comas
        likedBy = likedByArray.join(', ');

        // Actualizar la base de datos
        await db.query( 'UPDATE posts SET likedBy = ?, likesCount = ? WHERE id = ?', [likedBy, likedByArray.length, postId]);

        res.json({ message: 'Like agregado', likedBy, likesCount: likedByArray.length });
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al agregar el like', details: err.message });
    }
};



// Quitar like a un post
exports.removeLikeFromPost = async (req, res) => {
    const postId = parseInt(req.params.id); // ID del post
    const { user } = req.body; // Usuario que quita el like

    try {
        // Validar que el usuario no esté vacío
        if (!user || typeof user !== 'string' || user.trim() === '') {
            return res.status(400).json({ error: 'El usuario es obligatorio y debe ser un string válido.' });
        }

        // Obtén el campo likedBy del post
        const [rows] = await db.query('SELECT likedBy FROM posts WHERE id = ?', [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Obtener el campo likedBy como string
        let likedBy = rows[0].likedBy || '';

        // Convertir el string a un array de nombres separados por comas
        let likedByArray = likedBy.split(',').map(name => name.trim()).filter(Boolean);

        // Quitar el usuario del array
        const updatedLikedByArray = likedByArray.filter(username => username !== user);

        // Convertir de nuevo a un string separado por comas
        const updatedLikedBy = updatedLikedByArray.join(', ');

        // Actualizar la base de datos
        await db.query(
            'UPDATE posts SET likedBy = ?, likesCount = ? WHERE id = ?',
            [updatedLikedBy || null, updatedLikedByArray.length, postId]
        );

        res.json({ message: 'Like eliminado', likedBy: updatedLikedBy, likesCount: updatedLikedByArray.length });
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al eliminar el like', details: err.message });
    }
};

// Obtener todos los posts creados por un usuario
exports.getPostsByUser = async (req, res) => {
  try {
        const [rows] = await db.query( 'SELECT * FROM posts WHERE user = ?', [req.params.user]);     // Consulta a la base de datos filtrando por usuario
        res.json(rows);                                                                             // Devuelve los posts creados por el usuario
    }
    catch (err) {
        res.status(500).json({ error: 'Error al obtener los posts', details: err.message });
    }
};

// Obtener todos los posts "likeados" por un usuario
exports.getPostsLikedByUser = async (req, res) => {
    try {
        // Consulta los posts donde el usuario esté incluido en el string likedBy
        const [rows] = await db.query( 'SELECT * FROM posts WHERE FIND_IN_SET(?, REPLACE(likedBy, ", ", ",")) > 0', [req.params.user]);
        res.json(rows);
    } 
    catch (err) {
        res.status(500).json({ error: 'Error al obtener los posts likeados', details: err.message });
    }
};
