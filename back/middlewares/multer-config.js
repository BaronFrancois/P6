// Le fichier multer-config.js semble être une configuration pour le package Multer, qui est souvent utilisé pour gérer les téléchargements de fichiers dans les applications Node.js. 

// Importation du package multer pour gérer les téléchargements de fichiers
const multer = require('multer');

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Le terme "MIME" signifie "Multipurpose Internet Mail Extensions" (Extensions multifonctions du courrier Internet).
//  Il s'agit d'un standard qui a été introduit pour étendre les capacités du courrier électronique, mais il est maintenant utilisé dans de nombreux contextes Internet différents, y compris le Web.
//  Dans le contexte des fichiers et des requêtes HTTP, le "type MIME" est une manière de spécifier le type de données que le fichier contient.
//  Il est utilisé pour décrire le contenu des fichiers afin que les applications puissent savoir comment traiter ces fichiers.
// Un type MIME est généralement composé de deux parties : un type et un sous-type, séparés par un slash (/)
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Définition des types MIME acceptés et leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configuration de l'emplacement de stockage des fichiers téléchargés
const storage = multer.diskStorage({
    // Le dossier où les fichiers seront stockés
    destination: "images",
    // Définition de la propriété filename pour le stockage sur disque
    filename: (req, file, callback) => {
        console.log(file)
        // Récupération du nom original du fichier et suppression de l'extension
        let name =  file.originalname.split('.')[0]
        // Affichage du nom dans la console avec un identifiant '14' (pour le débogage)
        console.log(name,'14')
        // Remplacement des espaces dans le nom par des underscores
        name = name.split(' ').join('_');
        // Affichage du nouveau nom dans la console avec un identifiant '16' (pour le débogage)
        console.log(name,'16')
        // Récupération de l'extension du fichier à partir du type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Vérification de l'extension
        if (extension == undefined) {
            // Si le type MIME n'est pas valide, une erreur est renvoyée
            callback(new Error('Invalid MIME TYPES'));
        } else {
            // Sinon, le nom du fichier est créé en ajoutant un timestamp à la fin
            // et l'extension est ajoutée
            callback(null, name + Date.now() + '.' + extension);
        }
    }}
);

module.exports = multer({ storage });