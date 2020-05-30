const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);//Créer un compte
router.post('/login', userCtrl.login);//Se connecter
router.put('/update', userCtrl.updateUser)//Mettre à jour son profile
router.delete('/delete', userCtrl.deleteUser)//Supprimer son profile
router.get('/profil', userCtrl.getUserProfil)//Afficher le profile

module.exports = router;