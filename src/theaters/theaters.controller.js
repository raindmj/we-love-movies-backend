const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");
const service = require("./theaters.service");

async function list(req, res, next) {
  const allTheatersAndMovies = await service.listTheaters();

  //reduce the data into only the information needed
  const reduceMoviesAndTheaters = reduceProperties("theater_id", {
    //specify the information needed in each object
    theaters_created_at: ["created_at"],
    theaters_updated_at: ["updated_at"],
    //add new array to each object called "movies"
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    movies_created_at: ["movies", null, "created_at"],
    movies_updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
  });

  //call on function with the obtained data
  const theatersWithMovies = reduceMoviesAndTheaters(allTheatersAndMovies);

  res.json({ data: theatersWithMovies });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
