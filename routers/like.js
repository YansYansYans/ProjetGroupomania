//Importe Express
const express = require('express')
const router = express.Router()

//Importe Auth
const auth = require('../middleware/auth')
//Importe likeController
const likeController = require('../controllers/like')

//Crée les différents routes vers le controllers
//Afficher les likes
router.get('/post/:id/like', auth, likeController.getPostLikes)
//Liker 
router.post('/post/:id/like', auth, likeController.createLike)
//Supprimer un like
router.delete('/post/:id/like', auth, likeController.deleteLike)

module.exports = router;