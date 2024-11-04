const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.get('/', likesController.getAllLikes);
router.post('/', likesController.addLike);
router.delete('/:id', likesController.removeLike);

module.exports = router;
