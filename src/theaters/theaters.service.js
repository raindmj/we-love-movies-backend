const knex = require("../db/connection");

function listTheaters() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      "m.*",
      "t.*",
      "mt.*",
      "m.created_at as movies_created_at",
      "m.updated_at as movies_updated_at",
      "t.created_at as theaters_created_at",
      "t.updated_at as theaters_updated_at"
    );
}

module.exports = {
  listTheaters,
  // listMovies,
};
