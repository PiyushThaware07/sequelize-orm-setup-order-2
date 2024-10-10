const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    username: "postgres",
    password: "root",
    database: "graphql-db",
    port: 5432,
    dialect: "postgres",
    host: "localhost",
    logging: false
})


module.exports = sequelize;