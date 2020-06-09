const express = require('express');
const router = express.Router();

const msgCtrl = require('../controllers/message');
const likeCtrl = require('../controllers/like');
const multer = require('../middlewares/multer-config')

router.get('/', msgCtrl.getAllMessage);//Afficher tout les messages
router.post('/new', multer, msgCtrl.newMessage);//Afficher les messages récents
router.get('/:id', msgCtrl.getOneMessage);//Afficher un message
router.put('/update/:id', msgCtrl.updateMessage);//Mettre à jour un message
router.delete('/delete/:id', msgCtrl.deleteMessage);//Supprimer un message

router.post('/like', likeCtrl.likeMessage)

module.exports = router;