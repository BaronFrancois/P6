const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauce.controller');

const auth = require('../middlewares/auth.middleware');
const multer = require('../middlewares/multer-config');


router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.evaluateSauce);


router.post('/', auth, multer.single("image"), (req, res, next) => {
    console.log("Route POST /api/sauces atteinte.");
    saucesCtrl.createSauce(req, res, next);
});

// Ajout d'un console.log pour le débogage
router.put('/:id', auth, multer.single("image"), (req, res, next) => {
    console.log("Route PUT /api/sauces/:id atteinte.");
    saucesCtrl.modifySauce(req, res, next);
});

module.exports = router;