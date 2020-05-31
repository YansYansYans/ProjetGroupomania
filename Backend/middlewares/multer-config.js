const multer = require('multer');//Importe Multer
const path = require('path')//Importe Multer

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};


const storage = multer.diskStorage({//Creation d'un objet de configuration pour Multer
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const extPath = path.extname(`/images/${file.originalname}`);
        const name = file.originalname.split(' ').join('_').split('-').join('_').split(extPath).join('');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + '.' + extension);
    }

});

module.exports = multer({ storage: storage }).single('image');

