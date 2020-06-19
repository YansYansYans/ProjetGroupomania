//Importation des modeles
const Comment = require('../models/comment');

//Voir les commentaires
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({ where : {
            postId: req.params.id
        }})
        if (!comments) {
            return res.status(200).send({ message: "Aucun commentaire"})
        }
        res.status(200).send(comments)
    } catch (err) {
        res.status(500).send(err)
    }
}

//Créer un commentaire
exports.createComment = async (req, res) => {
    try {
        await Comment.create({
            userId: req.user.id,
            avatar: req.user.imageUrl,
            username: req.user.username,
            postId: req.params.id,
            content: req.body.content
        })
        res.status(201).send({ message: "Commentaire créé"})
    } catch (err) {
        res.status(500).send(err)
    }
}

//Supprimer un commentaire
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ where: {
            id: req.body.id
        }})
        if (!(req.user.id === comment.userId)) {
            return res.status(401).send({ message: 'Vous ne pouvez pas supprimer ce commentaire'})
        }
        await Comment.destroy({ where: {
            userId: req.user.id,
            id: req.body.id
        }})
        res.status(200).send({ message: "Commentaire supprimé"})
    } catch (err) {
        res.status(500).send(err)
    }
}