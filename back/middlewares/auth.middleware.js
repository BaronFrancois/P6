// Importation du package jwt pour gérer les JSON Web Tokens
const jwt = require('jsonwebtoken');

// Utilisation du package dotenv pour lire les variables d'environnement
const dotenv = require('dotenv');
dotenv.config();

///////////////////////////////////////////////////////////////////////////////////////////////////////
// process.env = process est un objet global en Node.js qui fournit des informations sur le processus en cours d'exécution.
//  process.env est un objet qui contient les variables d'environnement sous la forme de paires clé-valeur.
///////////////////////////////////////////////////////////////////////////////////////////////////////

// Récupération de la clé secrète depuis les variables d'environnement
const SECRET_TOKEN = process.env.SECRET_KEY;

// Exportation du middleware
module.exports = (req, res, next) => {
    try {
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Authorization: Bearer <TOKEN> = La méthode .split(' ') divise cette chaîne en un tableau où le premier élément est le mot "Bearer" et le deuxième élément est le jeton d'authentification (<TOKEN>)
        // En utilisant [1], on accède au deuxième élément du tableau (<TOKEN> dans notre cas), ce qui nous permet d'isoler le jeton d'authentification pour une utilisation ultérieure dans le code, comme pour la vérification de l'authentification ou de l'autorisation.
        // C'est donc une manière de parser l'en-tête Authorization pour en extraire le jeton d'authentification.
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // Extraction du token JWT depuis les en-têtes de la requête
        const token = req.headers.authorization.split(' ')[1];
        // Vérification et décodage du token
        const decodedToken = jwt.verify(token, SECRET_TOKEN);
        // Extraction de l'identifiant de l'utilisateur depuis le token décodé
        const userId = decodedToken.userId;
        // Ajout de l'identifiant de l'utilisateur à l'objet req pour une utilisation ultérieure
        req.auth = {
            userId: userId
        };
        // Passe au middleware suivant
        next();
    } catch(error) {
        console.error('Erreur dans le middleware auth:', error);  // Log de débogage pour les erreurs
        res.status(401).json({ error });
    }
};