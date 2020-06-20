//Importe Sequelize
const Sequelize = require('sequelize');

//Importe la base de donnée (nom_basededonnée , nom_userbdd , psw_userbdd)
const sequelize = new Sequelize('test_test', 'root', 'Jemappelle95@', {
    host: 'localhost',
    dialect: 'mysql'
});

//Importe les messages de connexion reussis ou échouées
const dbConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connected to database')
    } catch (err) {
        throw new Error('Something went wrong')
    }
}
module.exports = { sequelize, dbConnection }