const { Sequelize } = require("sequelize");

const db = new Sequelize("postgres://localhost:5432/playlist_api", {
  logging: false,
});

module.exports = db;