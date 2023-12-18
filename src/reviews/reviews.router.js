const router = require("express").Router({ mergeParams: true });
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./reviews.controller");

router
  .route("/:reviewId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.destroy)
  .all(methodNotAllowed);

module.exports = router;
