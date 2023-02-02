var express = require('express');
var router = express.Router();
const passport = require('passport');

// Require controller modules.
const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

// POST request for creating a Post. NOTE This must come before routes that display Post (uses id).
router.post("/create", passport.authenticate('jwt', {session: false}), post_controller.post_create);

// POST request for creating a new comment on a single post.
router.post("/:postid/comments/create", comment_controller.comment_create);

// GET request for one Comment.
router.get("/:postid/comments/:commentid", comment_controller.single_comment);

// GET request for list of all comments on a single post.
router.get("/:postid/comments", comment_controller.list_comments);

// GET request for list of all posts.
router.get("/", post_controller.post_list);

// GET request for one Post.
router.get("/:id", post_controller.post_detail);



module.exports = router;