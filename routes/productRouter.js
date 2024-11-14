const express = require('express');
const ProductController = require('../controllers/ProductController.js');
const productImageUpload = require('../middlewares/multer.config.js'); 
const validateObjectId = require('../middlewares/validateObjectId.config.js'); 
const auth = require('../middlewares/auth.js');
const router = express.Router();

router.get('/', auth ,ProductController.list);
router.get('/:id', auth ,validateObjectId, ProductController.show); 
router.post('/', productImageUpload ,auth , ProductController.create);
router.put('/:id', validateObjectId, productImageUpload ,auth , ProductController.update); 
router.delete('/:id', validateObjectId, auth ,ProductController.delete);

module.exports = router;
