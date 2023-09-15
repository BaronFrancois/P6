// Importation du module Express pour créer une application web
const express = require('express');
// Importation du module path pour manipuler les chemins de fichiers
const path = require('path');
// Importation de body-parser pour analyser le corps des requêtes HTTP
const bodyParser = require("body-parser")


// Création de l'app Express
const app = express();

// Importation des fichiers de routes pour différentes parties de l'application
const sauceRoutes = require('./routes/sauce.routes');
const userRoutes = require('./routes/user.routes');

// Configuration des headers HTTP pour contourner les problèmes de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//ajoute un middleware qui est capable de parser les corps de requêtes au format JSON
app.use(bodyParser.json());
//ajoute un middleware qui parse les corps de requêtes qui sont encodées en utilisant le type de contenu application/x-www-form-urlencoded. C'est le format de données des formulaires HTML standard
app.use(bodyParser.urlencoded());


// Définition des chemins pour les différentes routes de l'API
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Définition d'un middleware pour servir des fichiers statiques (images dans ce cas)
// Le répertoire 'images' sera accessible via le chemin '/images'
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
