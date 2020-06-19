//Importation des modeles
const User = require('../models/user');

//Importation des packages
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'SECRET_KEY')
        const user = await User.findOne({ where: {
            id: decodedToken.id }
        })
        if (! user) {
            throw new Error
        }
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({ error: 'Veuillez vous authentifier'})
    }
}


