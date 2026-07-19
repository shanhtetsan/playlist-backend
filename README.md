# Playlist Backend

A REST API for managing playlists and songs, built with Express, Sequelize, and PostgreSQL.

Part of a full-stack "simplified Spotify" project. Pairs with [playlist-frontend](https://github.com/shanhtetsan/playlist-frontend).

## Stack

- **Node.js + Express** — server and routing
- **PostgreSQL** — database
- **Sequelize** — ORM
- **cors** — enables requests from the React frontend

## Data Model

```
Playlist ──< has many >── Song
   1                        many
```

A `Playlist` has a `name` and `description`. A `Song` has a `title`, `artist`, and `duration` (stored in seconds). Each `Song` belongs to exactly one `Playlist` via a `PlaylistId` foreign key. Deleting a playlist also deletes its songs (no orphaned records).

## Setup

```bash
npm install
createdb playlist_api
npm run seed   # creates tables and adds sample data
npm run dev    # starts the server on http://localhost:3000
```

## API Routes

### Playlists

| Method | Route | Description |
|---|---|---|
| GET | `/playlists` | Get all playlists |
| GET | `/playlists/:id` | Get one playlist, with its songs included |
| POST | `/playlists` | Create a playlist (`name`, `description`) |
| PATCH | `/playlists/:id` | Update a playlist |
| DELETE | `/playlists/:id` | Delete a playlist and its songs |
| POST | `/playlists/:id/songs` | Add a song to this playlist (`title`, `artist`, `duration`) |

### Songs

| Method | Route | Description |
|---|---|---|
| DELETE | `/songs/:id` | Delete a song |

### Misc

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check, returns `{ status: "ok" }` |

## Status Codes

- `200` — successful read/update
- `201` — successful create
- `204` — successful delete (empty body)
- `400` — bad input (missing fields, invalid JSON)
- `404` — resource not found
- `500` — unexpected server error

## Notes

- `db.sync()` runs on server start to keep tables in sync with the models. `seed.js` uses `sync({ force: true })` to wipe and rebuild — only ever run this intentionally, since it deletes all existing data.
- Song `duration` is stored as an integer (seconds), not a formatted string — this keeps sorting and math on the frontend simple.
