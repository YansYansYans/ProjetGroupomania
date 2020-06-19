//Importe Express
const express = require('express');
const router = express.Router();

//Importe Multer
const multer = require('../middleware/multer');
//Importe Auth
const auth = require('../middleware/auth');
//Importe userController
const userController = require('../controllers/user');

//Crée les différents routes vers le controllers
//Créer un compte
router.post('/api/auth/signup', multer, userController.signup);
//Se connecter
router.post('/api/auth/login', userController.login);
//Afficher le profile
router.get('/user/me', auth, userController.getProfile);
//Supprimer le compte 
router.delete('/user/me', auth, multer, userController.deleteProfile);
//Mettre à jour le profile
router.put('/user/me', auth, multer,  userController.updateProfile);

module.exports = router;
