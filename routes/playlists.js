const express = require("express");
const router = express.Router();
const { Playlist, Song } = require("../models");

// GET all playlists
router.get("/", async (req, res) => {
  const playlists = await Playlist.findAll({
    include: Song,
  });
  const playlistsWithCount = playlists.map((playlist) => ({
    ...playlist.toJSON(),
    songCount: playlist.Songs.length,
  }));
  res.json(playlistsWithCount);
});

// GET one playlist, with its songs included
router.get("/:id", async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.id, {
    include: Song,
  });
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  res.json(playlist);
});

function requireNameAndDescription(req, res, next) {
  if (!req.body || !req.body.name || !req.body.description) {
    return res.status(400).json({ error: "name and description are required" });
  }
  next();
}

// GET all songs in a specific playlist
router.get("/:id/songs", async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.id);
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  const songs = await Song.findAll({ where: { PlaylistId: req.params.id } });
  res.json(songs);
});

router.get("/:id", async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.id, {
    include: Song,
    order: [[Song, "order", "ASC"]],
  });
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  res.json(playlist);
});

// CREATE a playlist
router.post("/", requireNameAndDescription, async (req, res, next) => {
  try {
    const playlist = await Playlist.create(req.body);
    res.status(201).json(playlist);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
});

// UPDATE a playlist

router.patch("/:id", async (req, res, next) => {
  try {
    const playlist = await Playlist.findByPk(req.params.id);
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required" });
    }
    await playlist.update(req.body);
    res.json(playlist);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
});

// REORDER songs in this playlist
router.patch("/:id/songs/reorder", async (req, res, next) => {
  try {
    const { songIds } = req.body; // array of song ids, in desired order
    if (!Array.isArray(songIds)) {
      return res.status(400).json({ error: "songIds must be an array" });
    }

    await Promise.all(
      songIds.map((songId, index) =>
        Song.update({ order: index }, { where: { id: songId, PlaylistId: req.params.id } })
      )
    );

    const songs = await Song.findAll({
      where: { PlaylistId: req.params.id },
      order: [["order", "ASC"]],
    });
    res.json(songs);
  } catch (err) {
    next(err);
  }
});

// DELETE a playlist (and its songs, so none are left orphaned)
router.delete("/:id", async (req, res) => {
  const playlist = await Playlist.findByPk(req.params.id);
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  await Song.destroy({ where: { PlaylistId: playlist.id } });
  await playlist.destroy();

  res.sendStatus(204);
});

function requireSongFields(req, res, next) {
  if (!req.body || !req.body.title || !req.body.artist || !req.body.duration) {
    return res.status(400).json({ error: "title, artist, and duration are required" });
  }
  next();
}

// ADD a song to this specific playlist
router.post("/:id/songs", requireSongFields, async (req, res, next) => {
  try {
    const song = await Song.create({
      ...req.body,
      PlaylistId: req.params.id,
    });
    res.status(201).json(song);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
});

module.exports = router;