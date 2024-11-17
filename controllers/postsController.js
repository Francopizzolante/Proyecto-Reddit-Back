// postsController.js
const db = require('../config/db');

// Obtener todos los posts
exports.getAllPosts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los posts', details: err.message });
    }
};

// Crear un nuevo post
exports.createPost = async ({ titulo, descripcion, user, imagen }) => {
    try {
        const [result] = await db.query(
            'INSERT INTO posts (titulo, descripcion, user, imagen) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, user, imagen]
        );
        return { id: result.insertId, titulo, descripcion, user, imagen };
    } catch (err) {
        console.error('Error al crear el post:', err); // Imprime errores de la base de datos
        throw err;
    }
};

// Obtener un post por su ID
exports.getPostById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el post', details: err.message });
    }
};

// Obtener el título de un post por su ID
exports.getPostTitleById = async (req, res) => {
    const { id } = req.params; // ID del post pasado como parámetro
    try {
        const [rows] = await db.query('SELECT titulo FROM posts WHERE id = ?', [id]); // Consulta a la base de datos
        if (rows.length > 0) {
            res.json({ titulo: rows[0].titulo }); // Devuelve solo el título
        } else {
            res.status(404).json({ error: 'Post no encontrado' });
        }
    } catch (err) {
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
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el post', details: err.message });
    }
};

// Dar like a un post
exports.addLikeToPost = async (req, res) => {
    const postId = parseInt(req.params.id); // ID del post
    const user = req.body.user; // Usuario que da like (recibido como string)

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
        await db.query(
            'UPDATE posts SET likedBy = ?, likesCount = ? WHERE id = ?',
            [likedBy, likedByArray.length, postId]
        );

        res.json({
            message: 'Like agregado',
            likedBy,
            likesCount: likedByArray.length,
        });
    } catch (err) {
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

        res.json({
            message: 'Like eliminado',
            likedBy: updatedLikedBy,
            likesCount: updatedLikedByArray.length,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el like', details: err.message });
    }
};


// Obtener todos los posts creados por un usuario
exports.getPostsByUser = async (req, res) => {
  const { user } = req.params; // Obtiene el nombre del usuario desde los parámetros
  try {
      const [rows] = await db.query(
          'SELECT * FROM posts WHERE user = ?',
          [user]
      ); // Consulta a la base de datos filtrando por usuario
      if (rows.length > 0) {
          res.json(rows); // Devuelve los posts creados por el usuario
      } else {
          res.status(404).json({ error: 'No se encontraron posts creados por este usuario' });
      }
  } catch (err) {
      res.status(500).json({ error: 'Error al obtener los posts', details: err.message });
  }
};


// Obtener todos los posts "likeados" por un usuario
exports.getPostsLikedByUser = async (req, res) => {
    const { user } = req.params; // Nombre del usuario pasado como parámetro
    try {
        // Consulta los posts donde el usuario esté incluido en el string likedBy
        const [rows] = await db.query(
            'SELECT * FROM posts WHERE FIND_IN_SET(?, REPLACE(likedBy, ", ", ",")) > 0',
            [user]
        );

        if (rows.length > 0) {
            res.json(rows); // Devuelve los posts likeados
        } else {
            res.status(404).json({ error: `No se encontraron posts likeados por el usuario ${user}` });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los posts likeados', details: err.message });
    }
};
