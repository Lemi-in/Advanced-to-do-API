const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const collectionController= require('../controllers/collectionController');
const authMiddleware = require('../middleware/authMiddleware');


router.use(auth);

router.post('/', authMiddleware, collectionController.createCollection);
router.get('/', authMiddleware, collectionController.getCollections); 

router.delete('/:id', collectionController.deleteCollection);
router.patch('/:id/favorite', collectionController.toggleFavorite);
router.patch('/:id', collectionController.updateCollection); 

module.exports = router;
