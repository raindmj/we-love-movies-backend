const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");
const service = require("./theaters.service");

async function list(req, res, next) {
  const allTheatersAndMovies = await service.listTheaters();

  // console.log(allTheatersAndMovies);

  const reduceMoviesAndTheaters = reduceProperties("name", {
    //specify the information needed in each object
    name: ["name"],
    address_line_1: ["address_line_1"],
    address_line_2: ["address_line_2"],
    city: ["city"],
    state: ["state"],
    zip: ["zip"],
    //add new array to each object called "movies"
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
  });

  //call on function with the obtained data
  const theatersWithMovies = reduceMoviesAndTheaters(allTheatersAndMovies);
  // console.log(theatersWithMovies);

  res.json({ data: theatersWithMovies });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
