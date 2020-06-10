const models = require('../models')
const auth = require('../middlewares/auth')
const fs = require('fs');
const regex = /[a-zA-Z]/;
const view_content = 10

exports.newMessage = (req, res) => {
    const msgObject = JSON.parse(req.body.message)
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    models.User.findOne({
        where: { id: userId }
    }).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé !'
            });
        } else {
            if (!regex.test(msgObject.content)) {
                res.status(401).json({
                    message: "Merci de remplir tout les champs !",
                    'error': 'Champs Invalid'
                });
            } else {
                if (req.body.image === 'undefined') {
                    models.Message.create({
                        ...msgObject,
                        likes: 0,
                        userId: userId
                    })
                    return res.status(201).json({
                        message: 'Message publié!'
                    })
                } else {
                    models.Message.create({
                        ...msgObject,
                        attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                        likes: 0,
                        userId: userId
                    })
                    return res.status(201).json({
                        message: 'Message publié!'
                    })
                }
            }
        }
    }).catch(error => res.status(500).json({
        error: error,
        message: 'Attention : Impossible de poster le message !'
    }))
};

exports.getAllMessages = (req, res) => {
    let view = req.body.view;
    var order = req.query.order;
    if (view === undefined) {
        view = 15;
    }
    models.Message.findAll(({
            order: [(order != null) ? order.split(':') : ['id', 'DESC']],
            view: (!isNaN(view)) ? view : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        }))
        .then((messages) => { res.status(200).json(messages); })
        .catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Attention : Impossible de récupérer les messages !'
            });
        });
};

exports.getOneMessage = (req, res) => {
    models.Message.findOne({
            where: { id: req.params.id },
            include: [{
                    model: models.User,
                    attributes: ['username']
                },
                {
                    model: models.Comment,
                    attributes: ['content', 'id'],
                    include: [{
                        model: models.User,
                        attributes: ['username']
                    }]
                }
            ]
        })
        .then(message => { res.status(200).json(message); })
        .catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Attention : Impossible d afficher le messages !'
            });
        });
}

exports.updateMessage = (req, res) => {
    const messageId = req.params.id;
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin
    const content = req.body.content;

    models.Message.findOne({ where: { id: messageId } })
        .then(async function(message) {
            let newContent
            if (content === undefined) {
                newContent = message.content;
            } else {
                newContent = content;
            }
            if (newContent.length <= view_content) {
                return res.status(400).json({
                    message: "Attention : Modification impossible !",
                    'error': 'Parametre Invalid'
                });
            } else {
                if (message.userId == userId || admin === true) {
                    message.update({ content: message.content = content })
                    return res.status(201).json({
                        message: 'Message modifié'
                    })
                } else {
                    return error
                }
            }
        }).catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Attention : Vous ne pouvez pas modifier ce message !'
            });
        });
}

exports.deleteMessage = (req, res) => {
    const messageId = req.params.id;
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin
    console.log(admin)
    models.Message.findOne({ where: { id: messageId } })
        .then(async function(message) {
            if (!message) {
                return error
            } else {
                if (message.userId == userId || admin === true) {
                    {
                        try {
                            let liked = await models.Like.findAndCountAll({ where: { messageId: messageId } })
                            let likecount = await liked.count;
                            console.log(likecount)
                            for (let i = 0; i < likecount; i++) {
                                let likes = await models.Like.findOne({ where: { messageId: messageId } });
                                likes.destroy();
                            }
                            const filename = message.attachment.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                message.destroy();
                                return res.status(201).json({ message: 'Message supprimé' });
                            })
                        } catch (error) {
                            return error;
                        }
                    }
                } else {
                    return error
                }
            }
        }).catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Attention : Vous ne pouvez pas supprimer ce message !'
            });
        });
};

