const express = require("express");
const router = express.Router();
const { Song } = require("../models");

// DELETE a song
router.delete("/:id", async (req, res) => {
  const song = await Song.findByPk(req.params.id);
  if (!song) return res.status(404).json({ error: "Song not found" });
  await song.destroy();
  res.sendStatus(204);
});

module.exports = router;