const jwt = require('jsonwebtoken');

// Utilisation de dotenv
const dotenv = require('dotenv');
dotenv.config();
const SECRET_TOKEN = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, SECRET_TOKEN);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        console.error('Erreur dans le middleware auth:', error);  // Log de débogage pour les erreurs
        res.status(401).json({ error });
    }
};