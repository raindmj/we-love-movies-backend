const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  // console.log(review);
  if (review) {
    res.locals.review = review;
    return next();
  } else {
    next({
      status: 404,
      message: "Review cannot be found.",
    });
  }
}

function read(req, res, next) {
  const { review } = res.locals;
  res.json({ data: review });
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  console.log(data);
  res.json({ data });
}

async function destroy(req, res, next) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  update: [
    asyncErrorBoundary(reviewExists),
    // hasProperties("content", "score"),
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
