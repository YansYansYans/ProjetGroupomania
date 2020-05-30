const jwt = require('jsonwebtoken');
let jwt_sign = '<JWT_SIGN_TOKEN>';

module.exports = {
    generateToken: function(user) {
        return jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            },
            jwt_sign, {
                expiresIn: '12h'
            })
    },
    getUserId: function(headerAuth) {
        try {
            const token = headerAuth
            const decodedToken = jwt.verify(token, jwt_sign);
            const userId = decodedToken.userId;
            if (!userId) {
                throw 'UserId Invalid';
            } else {

                return decodedToken;
            }
        } catch (error) {}

    }
}