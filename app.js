const express = require("express");
const cors = require("cors");
const { db } = require("./models");
const playlistsRouter = require("./routes/playlists");
const songsRouter = require("./routes/songs");

const app = express();
app.use(cors());
app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/playlists", playlistsRouter);
app.use("/songs", songsRouter);

// 404 catch-all: no route above matched.
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Catch malformed JSON bodies (e.g. empty or invalid JSON)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  next(err);
});

// Error-handling middleware: FOUR params, and it lives LAST
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

db.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});