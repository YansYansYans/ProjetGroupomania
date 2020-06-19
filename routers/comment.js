//Importe Express
const express = require('express')
const router = express.Router()

//Importe Auth
const auth = require('../middleware/auth')
//Importe commentController
const commentController = require('../controllers/comment')

//Crée les différents routes vers le controllers
//Voir tout les commentaires
router.get('/post/:id/comments', auth, commentController.getAllComments)
//Créer un commentaire
router.post('/post/:id/comment', auth, commentController.createComment)
//Supprimer un commentaire
router.delete('/post/:id/comment', auth, commentController.deleteComment)

module.exports = router;