const express = require('express');
const router = express.Router();

const mmmCtrl = require('../controllers/message');
const likeCtrl = require('../controllers/like');
const multer = require('../middlewares/multer-config')

router.get('/', mmmCtrl.getAllMessage);//Afficher tout les messages
router.post('/new', multer, mmmCtrl.newMessage);//Afficher les messages récents
router.get('/:id', mmmCtrl.getOneMessage);//Afficher un message
router.put('/update/:id', mmmCtrl.updateMessage);//Mettre à jour un message
router.delete('/delete/:id', mmmCtrl.deleteMessage);//Supprimer un message

router.post('/like', likeCtrl.likeMessage)

module.exports = router;