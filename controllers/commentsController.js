const db = require('../config/db');

// Obtener todos los comentarios
exports.getAllComments = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM comments');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los comentarios', details: err.message });
    }
};

// Agregar un nuevo comentario
exports.addComment = async (req, res) => {
    const { postId, user, content } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO comments (postId, user, content) VALUES (?, ?, ?)',
            [postId, user, content]
        );
        res.json({ id: result.insertId, postId, user, content });
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el comentario', details: err.message });
    }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            res.json({ message: 'Comentario eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Comentario no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el comentario', details: err.message });
    }
};

// Obtener comentarios por postId
exports.getCommentsByPostId = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM comments WHERE postId = ?', [req.params.postId]);
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron comentarios para este post' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los comentarios', details: err.message });
    }
};

// Obtener comentarios por usuario
exports.getCommentsByUser = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM comments WHERE user = ?', [req.params.user]);
        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.status(404).json({ error: 'No se encontraron comentarios de este usuario' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los comentarios', details: err.message });
    }
};
