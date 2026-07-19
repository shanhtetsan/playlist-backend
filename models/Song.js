const { DataTypes } = require("sequelize");
const db = require("../db");

const Song = db.define("Song", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  artist: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { notEmpty: true },
  },
});

module.exports = Song;