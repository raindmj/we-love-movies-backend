const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//remove created_at and updated_at from movies
function removeCreatedUpdatedFromMovies(movies) {
  return movies.map((movie) => {
    const {
      movie_id,
      title,
      runtime_in_minutes,
      rating,
      description,
      image_url,
    } = movie;
    return {
      movie_id,
      title,
      runtime_in_minutes,
      rating,
      description,
      image_url,
    };
  });
}

async function list(req, res, next) {
  const { is_showing } = req.query;
  if (is_showing === "true") {
    const isShowingMovies = await service.listIsShowing();
    res.json({ data: removeCreatedUpdatedFromMovies(isShowingMovies) });
  } else {
    const allMovies = await service.list();
    res.json({ data: removeCreatedUpdatedFromMovies(allMovies) });
  }
}

//check if movie exists for given movie id
//if exists, go to next function
//if it doesn't exist, go next to error
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  } else {
    next({
      status: 404,
      message: "Movie cannot be found.",
    });
  }
}

async function read(req, res, next) {
  //get movie from the movieExists function using res.locals
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function listTheaters(req, res, next) {
  const { movieId } = req.params;
  const allTheatersWithMovieId = await service.listTheaters(movieId);
  res.json({ data: allTheatersWithMovieId });
}

async function listReviews(req, res, next) {
  const { movieId } = req.params;
  const allReviewsWithMovieId = await service.listReviews(movieId);
  res.json({ data: allReviewsWithMovieId });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  listTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
