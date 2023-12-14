const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//controller functions
async function list(req, res, next) {
  // console.log("QUERY:", req.query);
  const { is_showing } = req.query;
  // console.log("IS SHOWING OR NOT:", is_showing);
  // console.log(typeof is_showing);
  if (is_showing === "true") {
    const isShowingMovies = await service.listIsShowing();
    // console.log("IS SHOWING MOVIES:", isShowingMovies);
    res.json({ data: isShowingMovies });
  } else {
    const allMovies = await service.list();
    // console.log("ALL MOVIES:", allMovies);
    res.json({ data: allMovies });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};
