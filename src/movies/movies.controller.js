const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

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
      id: movie_id,
      title,
      runtime_in_minutes,
      rating,
      description,
      image_url,
    };
  });
}

async function list(req, res, next) {
  // console.log("QUERY:", req.query);
  const { is_showing } = req.query;
  // console.log("IS SHOWING OR NOT:", is_showing);
  // console.log(typeof is_showing);
  if (is_showing === "true") {
    const isShowingMovies = await service.listIsShowing();
    // console.log("IS SHOWING MOVIES:", isShowingMovies);
    res.json({ data: removeCreatedUpdatedFromMovies(isShowingMovies) });
  } else {
    const allMovies = await service.list();
    // console.log("ALL MOVIES:", allMovies);
    res.json({ data: removeCreatedUpdatedFromMovies(allMovies) });
  }
}

async function movieExists(req, res, next) {
  //get movieId from params
  const { movieId } = req.params;
  //get the movie requested by the param
  const movie = await service.read(movieId);
  //if the movie is found (exists),
  if (movie) {
    res.locals.movie = movie;
    //go to next function
    return next();
  } else {
    //if movie is not found with given movieId (doesn't exist), then go next with status and error message
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
  // console.log("LOOK HERE ***********", allReviewsWithMovieId);
  res.json({ data: allReviewsWithMovieId });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  listTheaters: asyncErrorBoundary(listTheaters),
  listReviews: asyncErrorBoundary(listReviews),
};
