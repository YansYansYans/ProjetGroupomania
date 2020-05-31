const bcrypt = require('bcryptjs');
var auth = require('../middlewares/auth');
const models = require('../models');

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//S'inscrire
exports.signup = (req, res) => {
	const name1 = req.body.name1;
    const name2 = req.body.name2;
    const pole = req.body.pole;
    const email = req.body.email;
    const mdp = req.body.mdp;
    if (!regex.test(email)) {
        res.status(401).json({
            message: 'Votre adresse mail est invalide',
            error: 'Email Invalid'
        });
    } else {
        models.User.findOne({
                where: { email: email }
            })
            .then(userCreated => {
                if (userCreated) {
                    return res.status(409).json({
                        message: 'Cet utilisateur est déjà utilisé',
                        error: 'User Invalid'
                    });
                } else {
                    const numberCharacter = mdp.length;
                    if (numberCharacter < 8) {
                        res.status(401).json({
                            message: 'Votre mot de passe doit contenir 8 caractères minimum',
                            error: 'MDP Invalid'
                        });
                    } else {
                        bcrypt.hash(mdp, 10)
                            .then(hash => {
                                let username = name1;
                                username += ' '
                                username += name2;
                                models.User.create({
                                    name1: name1,
                                    name2: name2,
                                    username: username,
                                    pole: pole,
                                    email: email,
                                    mdp: hash,
                                    isAdmin: false,
                                });
                                res.status(201).json({ message: 'Votre compte a bien été créé !' })
                            })
                    }
                }
            }).catch(error => res.status(500).json({
                message: "Impossible d'ajouter l'utilisateur",
                error: error
            }));
    }
};

//Se connecter
exports.login = (req, res) => {
    var email = req.body.email;
    var mdp = req.body.mdp;
    if (email == null || mdp == null) {
        return res.status(400).json({
            message: 'Merci de remplir tous les champs',
            error: 'Champs Invalid'
        });
    } else {
        models.User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    return error
                } else {
                    bcrypt.compare(mdp, user.mdp)//Mesure de Sécurite BCRYPT
                        .then(valid => {
                            if (!valid) {
                                return res.status(403).json({ message: 'Mot de passe incorrect !' });
                            }
                            res.status(200).json({
                                message: 'Utilisateur Connecté',
                                token: auth.generateToken(user)
                            })

                        })

                }
            }).catch(error => res.status(401).json({ message: 'Utilisateur Invalid', error: error }));
    }
};


//Mettre à jour son profile
exports.updateUser = (req, res) => {
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    const name1 = req.body.name1;
    const name2 = req.body.name2;
    const pole = req.body.pole;
    const mdp = req.body.mdp;
    models.User.findOne({
        where: { id: userId }
    }).then(user => {
        if (!user) {
            return error
        } else {
            user.update({name1: user.name1 = name1, name2: user.name2 = name2, pole: user.pole = pole, mdp: user.mdp = mdp })
            return res.status(201).json({ message: 'Utilisateur mis à jour!' })
        }
    }).catch(error => res.status(500).json({ message: "MAJ Utilisateur Invalid", error: error }));
};

// Supprimer un profile 
exports.deleteUser = (req, res) => {
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    models.User.findOne({ where: { id: userId } })
        .then(async function(user) {
            if (!user) {
                return error
            } else {
                try {
                    let liked = await models.Like.findAndCountAll({ where: { userId: userId } })
                    let likecount = await liked.count;
                    console.log(likecount)
                    for (let i = 0; i < likecount; i++) {
                        let likes = await models.Like.findOne({ where: { userId: userId } });
                        let message = await models.Message.findOne({ where: { id: likes.messageId } });
                        message.update({ likes: message.likes += -1 });
                        likes.destroy();
                    }
                    let messages = await models.Message.findAndCountAll({ where: { userId: userId } });
                    let messagecount = await messages.count;
                    for (let i = 0; i < messagecount; i++) {
                        let message = await models.Message.findOne({ where: { userId: userId } });
                        message.destroy();
                    }
                    user.destroy();
                    return res.status(201).json({ message: 'Compte supprimé' });
                } catch (error) {
                    return error;
                }
            }
        })
        .catch(error => res.status(401).json({ message: 'Supression Utilisateur Invalid', error: error }));
}

// Afficher un profile
exports.getUserProfil = (req, res) => {
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    models.User.findOne({
            where: { id: userId },
            attributes: ['email', 'username', 'pole']
        })
        .then(user => {
            console.log(user.username);
            if (user) {
                return res.status(200).json(user);
            } else { return error }
        }).catch(error => res.status(400).json({
            message: "Affichage Utilisateur Error",
            error: error
        }))
}