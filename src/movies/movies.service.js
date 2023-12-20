const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list() {
  return knex("movies").select("*");
}

function listIsShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id")
    .orderBy("m.movie_id");
}

function read(movieId) {
  return (
    knex("movies")
      .select("*")
      .where({ movie_id: movieId })
      //without first(), gives an array with the object
      .first()
  );
}

function listTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": movieId });
}

const addCritic = mapProperties({
  new_critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  critics_created_at: "critic.created_at",
  critics_updated_at: "critic.updated_at",
});

function listReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "c.*",
      "r.*",
      "c.updated_at as critics_updated_at",
      "c.created_at as critics_created_at",
      "c.critic_id as new_critic_id"
    )
    .where({ "r.movie_id": movieId })
    .then((data) => data.map(addCritic));
}

module.exports = {
  list,
  listIsShowing,
  read,
  listTheaters,
  listReviews,
};
