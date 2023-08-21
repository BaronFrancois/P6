const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');

router.get('/', sauceController.getSauces);
// doing sauces routes.
// router.get('/', sauceController);

//post routes
router.post('/', sauceController.postSauces);
router.post('/:id/like',sauceController.postLike);

//get routes
router.get('/:id', sauceController.getId);

//put routes
router.put('/:id',sauceController.updateId);

//delete routes
router.delete('/:id',sauceController.deleteId);



module.exports = router;