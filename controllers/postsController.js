// postsController.js
const posts = require('../Data/postsData');
let nextId = posts.length + 1;

// Obtener todos los posts
exports.getAllPosts = (req, res) => {
  res.json(posts);
};

// Crear un nuevo post
exports.createPost = (req, res) => {
  const { titulo, descripcion, imagen } = req.body;
  const newPost = { id: nextId++, titulo, descripcion, imagen };
  posts.push(newPost);
  res.json(newPost);
};

// Obtener un post por su ID
exports.getPostById = (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post no encontrado' });
  }
};

// Eliminar un post
exports.deletePost = (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index !== -1) {
    posts.splice(index, 1);
    res.json({ message: 'Post eliminado' });
  } else {
    res.status(404).json({ error: 'Post no encontrado' });
  }
};

// Marcar un post como 'liked'
exports.addLikeToPost = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isLiked = true; // O incrementar el conteo de likes
    post.likesCount += 1;
    res.json({ message: 'Post liked' });
  } else {
    res.status(404).json({ error: 'Post no encontrado' });
  }
};

// Quitar un 'like' a un post
exports.removeLikeFromPost = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isLiked = false; // O decrementar el conteo de likes
    post.likesCount = Math.max(0, post.likesCount - 1);
    res.json({ message: 'Like removido' });
  } else {
    res.status(404).json({ error: 'Post no encontrado' });
  }
};

// Obtener todos los posts creados por un usuario
exports.getPostsByUser = (req, res) => {
  const { user } = req.params; // Obtiene el nombre del usuario desde los parámetros
  const userPosts = posts.filter(post => post.user.toLowerCase() === user.toLowerCase()); // Filtra por usuario
  if (userPosts.length > 0) {
    res.json(userPosts); // Devuelve los posts creados por el usuario
  } else {
    res.status(404).json({ error: 'No se encontraron posts creados por este usuario' }); // Error si no hay posts
  }
};

// Obtener todos los posts likeados por un usuario
exports.getLikedPostsByUser = (req, res) => {
  const { user } = req.params; // Obtiene el nombre del usuario desde los parámetros
  const likedPosts = posts.filter(post => post.isLiked && post.user.toLowerCase() === user.toLowerCase()); // Filtra por likes y usuario
  if (likedPosts.length > 0) {
    res.json(likedPosts); // Devuelve los posts likeados por el usuario
  } else {
    res.status(404).json({ error: 'No se encontraron posts likeados por este usuario' }); // Error si no hay posts
  }
};
