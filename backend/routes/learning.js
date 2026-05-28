const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAllPaths, getPathById } = require('../controllers/learningController');

// If frontend has trouble with authentication, temporarily comment out 'protect' to test
// router.use(protect); 

router.get('/', getAllPaths);
router.get('/:id', getPathById);

module.exports = router;
