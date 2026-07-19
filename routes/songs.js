const express = require("express");
const router = express.Router();
const { Song } = require("../models");

// UPDATE a song
router.patch("/:id", async (req, res, next) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Request body is required" });
    }
    await song.update(req.body);
    res.json(song);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({ error: err.errors[0].message });
    }
    next(err);
  }
});

// DELETE a song
router.delete("/:id", async (req, res) => {
  const song = await Song.findByPk(req.params.id);
  if (!song) return res.status(404).json({ error: "Song not found" });
  await song.destroy();
  res.sendStatus(204);
});

module.exports = router;