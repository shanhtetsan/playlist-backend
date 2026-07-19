const db = require("../db");
const Playlist = require("./Playlist");
const Song = require("./Song");

Playlist.hasMany(Song);
Song.belongsTo(Playlist);

module.exports = { db, Playlist, Song };