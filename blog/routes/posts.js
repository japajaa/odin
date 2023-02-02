var express = require('express');
var router = express.Router();
const passport = require('passport');

// Require controller modules.
const post_controller = require("../controllers/postController");

// POST request for creating a Post. NOTE This must come before routes that display Post (uses id).
router.post("/create", passport.authenticate('jwt', {session: false}), post_controller.post_create);

// GET request for list of all posts.
router.get("/", post_controller.post_list);

// GET request for one Post.
router.get("/:id", post_controller.post_detail);

module.exports = router;