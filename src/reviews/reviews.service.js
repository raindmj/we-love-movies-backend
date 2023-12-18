const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

/* const addCritic = mapProperties({
  new_critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  critics_created_at: "critic.created_at",
  critics_updated_at: "critic.updated_at",
});

function update(updatedReview) {
  return knex("reviews as r")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
} */

async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

function update(review) {
  return knex("reviews as r")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

function destroy(reviewId) {
  return knex("reviews as r").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  update,
  destroy,
};
