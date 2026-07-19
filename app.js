const express = require("express");
const { db } = require("./models");

const app = express();
app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

db.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});