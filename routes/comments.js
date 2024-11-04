const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.get('/', commentsController.getAllComments);
router.post('/', commentsController.addComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;
