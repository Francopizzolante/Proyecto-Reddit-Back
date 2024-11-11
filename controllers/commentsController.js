const comments = require('../Data/commentsData');
let nextCommentId = comments.length + 1;

// Obtiene todos los comentarios almacenados y los devuelve como respuesta
exports.getAllComments = (req, res) => {
  res.json(comments);
};

// Agrega un nuevo comentario basado en la información proporcionada
exports.addComment = (req, res) => {
  const { postId, user, content } = req.body;
  const newComment = { id: comments.length + 1, postId, user, content };
  comments.push(newComment);
  res.json(newComment);
};

// Elimina un comentario identificado por su ID 
exports.deleteComment = (req, res) => {
  const commentIndex = comments.findIndex(comment => comment.id === parseInt(req.params.id));
  if (commentIndex !== -1) {
    comments.splice(commentIndex, 1);
    res.json({ message: 'Comentario eliminado' });
  } else {
    res.status(404).json({ error: 'Comentario no encontrado' });
  }
};

// Obtiene todos los comentarios asociados a un ID de publicación específico
exports.getCommentsByPostId = (req, res) => {
    const { postId } = req.params;
    const postComments = comments.filter(comment => comment.postId === parseInt(postId));
    if (postComments.length > 0) {
        res.json(postComments);
    } else {
        res.status(404).json({ error: 'No se encontraron comentarios para este post' });
    }
};

// Obtiene todos los comentarios realizados por un usuario específico
exports.getCommentsByUser = (req, res) => {
    const { user } = req.params;
    const userComments = comments.filter(comment => comment.user.toLowerCase() === user.toLowerCase());
    if (userComments.length > 0) {
        res.json(userComments);
    } else {
        res.status(404).json({ error: 'No se encontraron comentarios para este usuario' });
    }
};