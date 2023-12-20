const knex = require("../db/connection");

//get one review with given review id
function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

//get one critic with given critic id
async function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

//set a new property to review called critic
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

//update review where the passed in review obj with info to be updated has matching review id
//get the updatedReview and add new critic obj
function update(updatedReview) {
  return knex("reviews as r")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => read(updatedReview.review_id))
    .then(setCritic);
}

//delete a review with given review id
function destroy(reviewId) {
  return knex("reviews as r").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  update,
  destroy,
};
