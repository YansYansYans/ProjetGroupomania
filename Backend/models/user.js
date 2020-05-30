//Exportation de Sequelize (ORM qui permet l'utilisation de MySQL) et DataTypes (pour les types de données retransmit en chaine de caractères)
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
        name1: DataTypes.STRING,
        name2: DataTypes.STRING,
        username: DataTypes.STRING,
        pole: DataTypes.STRING,
        email: DataTypes.STRING,
        mdp: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }, {});
};