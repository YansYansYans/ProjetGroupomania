//Importation des modeles
const Like = require('../models/like');

//Affiche les likes
exports.getPostLikes = async (req, res) => {
    try {
        const like = await Like.findOne({ where: {
            postId: req.params.id,
            userIdLiked: req.user.id
        }})
        if (!like) {
            return res.status(200).send({ message: ''})
        }
        res.status(200).send(like)
    } catch (err) {
        res.status(500).send(err)
    }
}

//Liker
exports.createLike = async (req, res) => {
    try {
        await Like.create({
            like: req.body.like,
            postId: req.params.id,
            userIdLiked: req.user.id
        })
        res.status(201).send({ message: "J'aime"})
    } catch (err) {
        res.status(500).send(err)
    }
}

//Supprimer un like
exports.deleteLike = async (req, res) => {
    try {
        await Like.destroy({
            where: {
                userIdLiked: req.user.id,
                postId: req.params.id
            }
        })
        res.status(200).send({ message: "Je n'aime plus"})
    } catch (err) {
        res.status(500).send(err)
    }
}