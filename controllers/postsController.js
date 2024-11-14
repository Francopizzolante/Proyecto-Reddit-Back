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
        console.log('Guardando post en la base de datos:', { titulo, descripcion, user, imagen }); // Log para verificar los datos
        const [result] = await db.query(
            'INSERT INTO posts (titulo, descripcion, user, imagen) VALUES (?, ?, ?, ?)',
            [titulo, descripcion, user, imagen]
        );
        return { id: result.insertId, titulo, descripcion, user, imagen };
    } catch (err) {
        console.error('Error al crear el post en la base de datos:', err); // Imprime errores de la base de datos
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
    const { user } = req.body; // Usuario que da like

    try {
        // Obtén el campo likedBy del post
        const [rows] = await db.query('SELECT likedBy FROM posts WHERE id = ?', [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Validar y parsear likedBy
        let likedBy;
        try {
            likedBy = JSON.parse(rows[0].likedBy); // Intentar parsear como JSON
            if (!Array.isArray(likedBy)) {
                throw new Error(); // Si no es un array, lanzar un error
            }
        } catch (err) {
            likedBy = []; // Si no es JSON válido, inicializar como un array vacío
        }

        // Evitar duplicados
        if (!likedBy.includes(user)) {
            likedBy.push(user); // Agregar el usuario
        }

        // Actualizar la base de datos con el nuevo array JSON
        await db.query(
            'UPDATE posts SET likedBy = ?, likesCount = likesCount + 1 WHERE id = ?',
            [JSON.stringify(likedBy), postId]
        );

        res.json({ message: 'Like agregado', likedBy }); // Respuesta exitosa
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el like', details: err.message });
    }
};



// Quitar like a un post
exports.removeLikeFromPost = async (req, res) => {
    const postId = parseInt(req.params.id); // ID del post
    const { user } = req.body; // Usuario que quita el like

    try {
        // Obtén el campo likedBy del post
        const [rows] = await db.query('SELECT likedBy FROM posts WHERE id = ?', [postId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

        // Validar y parsear likedBy
        let likedBy;
        try {
            likedBy = JSON.parse(rows[0].likedBy); // Intentar parsear como JSON
            if (!Array.isArray(likedBy)) {
                throw new Error(); // Si no es un array, lanzar un error
            }
        } catch (err) {
            likedBy = []; // Si no es JSON válido, inicializar como un array vacío
        }

        // Quitar el usuario del array
        const updatedLikedBy = likedBy.filter(username => username !== user);

        // Actualizar la base de datos con el nuevo array JSON
        await db.query(
            'UPDATE posts SET likedBy = ?, likesCount = GREATEST(0, likesCount - 1) WHERE id = ?',
            [JSON.stringify(updatedLikedBy), postId]
        );

        res.json({ message: 'Like eliminado', likedBy: updatedLikedBy }); // Respuesta exitosa
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
      // Consulta los posts donde el usuario esté en el array likedBy
      const [rows] = await db.query('SELECT * FROM posts WHERE JSON_CONTAINS(likedBy, JSON_QUOTE(?))', [user]);

      if (rows.length > 0) {
          res.json(rows); // Devuelve los posts likeados
      } else {
          res.status(404).json({ error: `No se encontraron posts likeados por el usuario ${user}` });
      }
  } catch (err) {
      res.status(500).json({ error: 'Error al obtener los posts likeados', details: err.message });
  }
};
