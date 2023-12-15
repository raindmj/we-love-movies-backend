const knex = require("../db/connection");

function listTheaters(theaterId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      // "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating"
    );
  // .where({ "t.theater_id": theaterId });
  // .groupBy("t.theater_id");
}

/* function listMovies() {
  return knex("movies as m").select("*");
} */

module.exports = {
  listTheaters,
  // listMovies,
};
