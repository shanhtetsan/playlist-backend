const { DataTypes } = require("sequelize");
const db = require("../db");
const Playlist = db.define("Playlist", {
    name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },

  });

module.exports = Playlist;