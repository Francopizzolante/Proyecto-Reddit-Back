let posts = [
  { id: 1, titulo: 'Primer post', descripcion: 'Descripción del primer post', imagen: 'url1.jpg' },
  { id: 2, titulo: 'Segundo post', descripcion: 'Descripción del segundo post', imagen: 'url2.jpg' },
];

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

// Actualizar un post
exports.updatePost = (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (post) {
    const { titulo, descripcion, imagen } = req.body;
    post.titulo = titulo;
    post.descripcion = descripcion;
    post.imagen = imagen;
    res.json({ message: 'Post actualizado' });
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
