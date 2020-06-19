//Importe Express
const express = require('express')
const router = express.Router()

//Importe Multer
const multer = require('../middleware/multer')
//Importe Auth
const auth = require('../middleware/auth')
//Importe postController
const postController = require('../controllers/post')

//Crée les différents routes vers le controllers
//Voir toute les publications
router.get('/posts', auth, postController.getAllPosts)
//Voir une publication
router.get('/post/:id', auth, postController.getOnePost)
//Créer un message
router.post('/post', auth, multer, postController.createPost)
//Mettre à jour un message
router.put('/post/:id', auth, multer, postController.updatePost)
//Supprimer un message
router.delete('/post/:id', auth, multer,  postController.deletePost)

module.exports = router;