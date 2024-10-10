const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const commonConfig = {
    dialect: "postgres",
    logging: false,
    port: 5432,
    timezone: '+05:30',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: false,
        schema: 'public',
    },
};

const config = {
    development: {
        ...commonConfig,
        username: "postgres",
        password: "root",
        database: "codelab",
    },
    production: {
        ...commonConfig,
        url: process.env.DB_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        define: {
            ...commonConfig.define,
            schema: process.env.DB_SCHEMA,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};

const environment = process.env.NODE_ENV === "production" ? "production" : "development";
let sequelize;
if (process.env.NODE_ENV === "production") {
    const environment_sequelize = config[environment];
    sequelize = new Sequelize(environment_sequelize.url, environment_sequelize);
} else {
    const environment_sequelize = config[environment];
    sequelize = new Sequelize(environment_sequelize);
}

module.exports = sequelize;
