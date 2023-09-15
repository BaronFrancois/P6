// Importation du module HTTP intégré à Node.js pour créer un serveur HTTP
const http = require('http');
// Importation du fichier app.js qui doit contenir la logique de votre application
const app = require('./app');
// Importation du package mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');
// Importation de dotenv pour utiliser les variables d'environnement du fichier .env
require('dotenv').config();

// Définition d'une fonction pour normaliser le port d'écoute du serveur
const normalizePort = val => {
    const port = parseInt(val, 10);// Conversion de la valeur en nombre entier
    // Conversion de la valeur en nombre entier
        // Si la conversion échoue, retourner la valeur originale
            // Si le port est un nombre non négatif, retourner le port
                // Dans tous les autres cas, retourner false
        return port;
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Utilisation de la fonction normalizePort pour obtenir le port sur lequel le serveur doit écouter
const port = normalizePort(process.env.PORT || 3000);
// Récupération de l'URI de MongoDB à partir des variables d'environnement
const dbURI = process.env.MONGO_URI;

// Connexion à la base de données MongoDB en utilisant mongoose
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB!');
        console.log('Listening on port ' + port + '...');
    })
    .catch(err => console.log(err));

// Définition d'une fonction pour gérer les erreurs liées au serveur
    // Si l'erreur n'est pas liée à l'écoute du port
        // Lancer l'erreur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // Création d'un message d'erreur personnalisé
        // Vérification du code d'erreur
            // Accès refusé
                // Port déjà utilisé
                    // Afficher une erreur
                        // Quitter le processus avec un code d'erreur

                            // Le port est déjà utilisé
                                // Afficher une erreur
                                    // Quitter le processus avec un code d'erreur

                                        // Pour toutes les autres erreurs
                                            // Lancer l'erreur
    const bind = 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création d'un serveur HTTP en utilisant l'objet app importé depuis app.js
const server = http.createServer(app);

// Enregistrement d'un gestionnaire d'erreur sur l'événement 'error' du serveur
server.on('error', errorHandler);
// Enregistrement d'un écouteur pour l'événement 'listening' du serveur
    // Afficher un message lorsque le serveur commence à écouter
server.on('listening', () => {
    console.log('Listening on port: ' + port);
});

// Code pour faire écouter le serveur sur le port spécifié
server.listen(port);
