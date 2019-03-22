const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:123456@127.0.0.1:5432/postgres');

module.exports = db;
