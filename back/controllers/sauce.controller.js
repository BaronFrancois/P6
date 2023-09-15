const Sauce = require('../models/Sauce.model');  // Importe le modèle Mongoose pour les sauces
const fs = require('fs');  // Importe le module de système de fichiers Node.js pour manipuler les fichiers


const UNAUTHORIZED = 'Non autorisé';
const SAUCE_NOT_FOUND = 'Sauce non trouvée';
const INTERNAL_SERVER_ERROR = 'Erreur interne du serveur';
// /////////////////////////////////////////////////////////////////////////////////
// req = Cet objet représente la requête HTTP entrante. Il contient toutes les informations concernant la requête, y compris les paramètres, les en-têtes, le corps de la requête, etc.
// res = Cet objet représente la réponse HTTP que le serveur enverra au client. Vous pouvez utiliser cet objet pour envoyer une réponse au client,
// en définissant par exemple le statut HTTP, les en-têtes et le corps de la réponse.
// next = C'est une fonction de rappel qui indique à Express de passer à la prochaine fonction middleware dans la pile. Si votre fonction de gestionnaire (handler) ne termine pas la requête-réponse,
// vous devez appeler next() pour passer le contrôle au prochain gestionnaire. Sinon, la requête restera en suspens.
// /////////////////////////////////////////////////////////////////////////////////

exports.createSauce = (req, res, next) => {
  // Destructure les données de la requête
    const {
    name,
    manufacturer,
    description,
    mainPepper,
    heat} = JSON.parse(req.body.sauce)

    // /////////////////////////////////////////////////////////////////////////////////
    // L'expression req.file est souvent utilisée dans les applications Node.js qui utilisent le middleware multer pour gérer le téléchargement de fichiers.
    //  multer est un middleware pour la gestion des multipart/form-data, qui sont principalement utilisées pour le téléchargement de fichiers.
    // Lorsque le client envoie un fichier dans une requête HTTP, multer ajoute un objet file à l'objet de requête req.
    //  Cet objet contient des informations sur le fichier téléchargé, telles que le nom du fichier, le type MIME (Extensions multifonctions du courrier Internet), la taille du fichier, etc.
    // le "?" de req.file ? correspond à un if else
    // Crée l'URL de l'image à partir de la requête
     // /////////////////////////////////////////////////////////////////////////////////

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;

    // Instancie un nouvel objet "Sauce" avec les données
    const sauce = new Sauce({
        name, manufacturer, description, mainPepper, heat,
        userId: req.auth.userId,
        imageUrl: imageUrl
    });

    // Sauvegarde la nouvelle sauce dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ sauce }))
    .catch(error => res.status(400).json({ error }));
};
// /////////////////////////////////////////////////////////////////////////////////
// req.params.id =
// req: c'est l'objet de requête HTTP qui contient toutes les informations sur la requête entrante du client. 
// params: C'est un objet contenant les valeurs des paramètres de l'URL, nommés avec la syntaxe :nom dans la route. Par exemple, dans une route définie comme /sauces/:id, id est un paramètre que vous pouvez accéder via req.params.id.
// id: C'est le paramètre spécifique que nous extrayons de req.params. Il représente l'ID du document que nous voulons trouver dans la base de données.
//\_id = Dans MongoDB, chaque document a un champ unique appelé \_id qui sert de clé primaire. Ce champ est automatiquement généré.
// /////////////////////////////////////////////////////////////////////////////////

exports.modifySauce = (req, res, next) => {
  // Trouve la sauce en utilisant l'ID passé en paramètre
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if (!sauce) {
          return res.status(404).json({ message: SAUCE_NOT_FOUND });
        }
        if (sauce.userId !== req.auth.userId) {
          return res.status(401).json({ message: UNAUTHORIZED });
        }
        // Met à jour les données de la sauce
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
  

   // Supprime le fichier image associé à la sauce
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
  


// Utilise async/await pour récupérer une sauce par son ID
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
  
// Utilise async/await pour évaluer une sauce (like, dislike, ou annuler)
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
