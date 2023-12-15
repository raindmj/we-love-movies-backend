const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");
const service = require("./theaters.service");

async function list(req, res, next) {
  const allTheatersAndMovies = await service.listTheaters();

  // console.log(allTheatersAndMovies);

  const reduceMoviesAndTheaters = reduceProperties("name", {
    // theater_id: ["theater", "theater_id"],
    name: ["name"],
    address_line_1: ["address_line_1"],
    address_line_2: ["address_line_2"],
    city: ["city"],
    state: ["state"],
    zip: ["zip"],
    // movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
  });

  const theatersWithMovies = reduceMoviesAndTheaters(allTheatersAndMovies);
  console.log(theatersWithMovies);

  res.json({ data: theatersWithMovies[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
