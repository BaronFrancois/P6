// Importation du package password-validator pour la validation des mots de passe
const passwordValidator = require('password-validator');

// Création d'un nouveau schéma de validation de mot de passe
const passwordSchema = new passwordValidator();

// Configuration du schéma de validation pour les mots de passe
passwordSchema
.is().min(4)             // Longueur minimale : 4
.is().max(10)            // Longueur maximale : 10
.has().uppercase()       // Doit avoir au moins une majuscule
.has().lowercase()       // Doit avoir au moins une minuscule
.has().digits(1)         // Doit avoir au moins un chiffre
.has().not().spaces();   // Ne doit pas avoir d'espaces

// Exportation du middleware
module.exports = (req, res, next) => {
    // Validation du mot de passe dans le corps de la requête
    if (passwordSchema.validate(req.body.password)) {
        next();  // Passe au middleware suivant si le mot de passe est valide
    } else {
        // Retourne une erreur 400 si le mot de passe n'est pas valide
        return res.status(400).json({
            error: `Le mot de passe n'est pas assez fort :` + passwordSchema.validate(req.body.password, { list: true })
        });
    }
};
