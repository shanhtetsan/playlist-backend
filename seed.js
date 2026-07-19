const { db, Playlist, Song } = require("./models");

async function seed() {
  await db.sync({ force: true }); // wipe + rebuild — only ever in a seed script

  const chill = await Playlist.create({
    name: "Chill Vibes",
    description: "Relaxing songs for a slow afternoon",
  });

  await Song.create({ title: "Sunset Drive", artist: "Wave Runner", duration: 210, PlaylistId: chill.id });
  await Song.create({ title: "Slow Motion", artist: "Nova Fields", duration: 245, PlaylistId: chill.id });
  await Song.create({ title: "Golden Hour", artist: "Marina Lights", duration: 198, PlaylistId: chill.id });

  console.log("Seeded!");
  await db.close();
}

seed();