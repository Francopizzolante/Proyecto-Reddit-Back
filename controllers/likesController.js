// controllers/likesController.js
let likes = [
    { id: 1, postId: 1, userId: 1 },
    { id: 2, postId: 2, userId: 1 },
  ];
  
  exports.getAllLikes = (req, res) => {
    res.json(likes);
  };
  
  exports.addLike = (req, res) => {
    const { postId, userId } = req.body;
    const newLike = { id: likes.length + 1, postId, userId };
    likes.push(newLike);
    res.json(newLike);
  };
  
  exports.removeLike = (req, res) => {
    const likeIndex = likes.findIndex(like => like.id === parseInt(req.params.id));
    if (likeIndex !== -1) {
      likes.splice(likeIndex, 1);
      res.json({ message: 'Like eliminado' });
    } else {
      res.status(404).json({ error: 'Like no encontrado' });
    }
  };
  