const Sauce = require('../models/Sauce.model');
const fs = require('fs');

const UNAUTHORIZED = 'Non autorisé';
const SAUCE_NOT_FOUND = 'Sauce non trouvée';
const INTERNAL_SERVER_ERROR = 'Erreur interne du serveur';

exports.createSauce = (req, res, next) => {
    const {
    name,
    manufacturer,
    description,
    mainPepper,
    heat} = JSON.parse(req.body.sauce)
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    const sauce = new Sauce({
        name, manufacturer, description, mainPepper, heat,
        userId: req.auth.userId,
        imageUrl: imageUrl
    });

    sauce.save()
    .then(() => res.status(201).json({ sauce }))
    .catch(error => res.status(400).json({ error }));
};
  
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (!sauce) {
          return res.status(404).json({ message: SAUCE_NOT_FOUND });
        }
        if (sauce.userId !== req.auth.userId) {
          return res.status(401).json({ message: UNAUTHORIZED });
        }
  
        const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
  
        return Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
      })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
      .catch(error => res.status(400).json({ error }));
  };
  

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (!sauce) {
          return res.status(404).json({ message: SAUCE_NOT_FOUND });
        }
        if (sauce.userId !== req.auth.userId) {
          return res.status(401).json({ message: UNAUTHORIZED });
        }
  
        const filename = sauce.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(400).json({ error }));
  };
  


// Afficher une seule sauce avec son ID
exports.getOneSauce = async (req, res, next) => {
    try {
      const sauce = await Sauce.findOne({ _id: req.params.id });
      if (!sauce) {
        return res.status(404).json({ message: SAUCE_NOT_FOUND });
      }
      res.status(200).json(sauce);
    } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  };
  
  // Afficher toutes les sauces
  exports.getAllSauces = async (req, res, next) => {
    try {
      const sauces = await Sauce.find();
      res.status(200).json(sauces);
    } catch (error) {
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  };
  
  // Évaluer une sauce
  exports.evaluateSauce = async (req, res, next) => {
    try {
      const sauce = await Sauce.findOne({ _id: req.params.id });
      if (!sauce) {
        return res.status(404).json({ message: SAUCE_NOT_FOUND });
      }
  
      switch (req.body.like) {
        case -1:
          await Sauce.updateOne({ _id: req.params.id }, {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId }
          });
          res.status(201).json({ message: "Votre avis est bien pris en compte (dislike) !" });
          break;
  
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            await Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId }
            });
            res.status(201).json({ message: "Votre avis a bien été modifié !" });
          } else if (sauce.usersDisliked.includes(req.body.userId)) {
            await Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            });
            res.status(201).json({ message: "Votre avis a bien été modifié !" });
          }
          break;
  
        case 1:
          await Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId }
          });
          res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" });
          break;
  
        default:
          res.status(500).json({ error: INTERNAL_SERVER_ERROR });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
  };
