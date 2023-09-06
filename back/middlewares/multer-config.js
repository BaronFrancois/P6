const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: "images",
    filename: (req, file, callback) => {
        console.log(file)
        let name =  file.originalname.split('.')[0]
        console.log(name,'14')
        name = name.split(' ').join('_');
        console.log(name,'16')
        const extension = MIME_TYPES[file.mimetype];
        if (extension == undefined) {
            callback(new Error('Invalid MIME TYPES'));
        } else {
            callback(null, name + Date.now() + '.' + extension);
        }
    }}
);

module.exports = multer({ storage });