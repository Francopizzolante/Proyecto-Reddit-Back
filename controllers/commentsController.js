let comments = [
    { id: 1, postId: 1, userId: 1, content: 'Comentario de prueba' },
    { id: 2, postId: 2, userId: 2, content: 'Otro comentario' },
  ];
  
  exports.getAllComments = (req, res) => {
    res.json(comments);
  };
  
  exports.addComment = (req, res) => {
    const { postId, userId, content } = req.body;
    const newComment = { id: comments.length + 1, postId, userId, content };
    comments.push(newComment);
    res.json(newComment);
  };
  
  exports.deleteComment = (req, res) => {
    const commentIndex = comments.findIndex(comment => comment.id === parseInt(req.params.id));
    if (commentIndex !== -1) {
      comments.splice(commentIndex, 1);
      res.json({ message: 'Comentario eliminado' });
    } else {
      res.status(404).json({ error: 'Comentario no encontrado' });
    }
  };
  