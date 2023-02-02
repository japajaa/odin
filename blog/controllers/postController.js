const Post = require("../models/post");
const User = require("../models/user");
// const async = require("async");
const { body, validationResult } = require("express-validator");


// Display list of all Posts.
exports.post_list = function (req, res, next) {
  Post.find({})
    .sort({ name: 1 })
    .populate("user")
    .exec(function (err, list_messages) {
      if (err) {
        return next(err);
      }
      //Successful, so send list as json
      res.json({messages: list_messages });
    });
};


// Display detail page for a specific post.
exports.post_detail = (req, res, next) => {
  Post.findById(req.params.id)
    .sort({ name: 1 })
    .populate("user")
    .exec(function (err, list_messages) {
      if (err) {
        return next(err);
      }
      //Successful, so send list as json
      res.json({messages: list_messages });
    });
};


// Handle Message create on POST.
exports.post_create = 
// [
  // Validate and sanitize the name field.
  // body("title", "Title for message is required").trim().isLength({ min: 1 }).escape(),
  // body("text").trim().isLength({ min: 1, max: 160 }).escape().withMessage('Message length must be 1-160 characters'),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    // const errors = validationResult(req);
    // Create a genre object with escaped and trimmed data.
    console.log('user is', req.user)
    const post = new Post({ title: req.body.title, text: req.body.text, user: req.user._id.toString(), date: Date.now() });
/*
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("message_form", {
        title: "Create Message",
        message,
        errors: errors.array(),
      });
      return;
    } else {
      */
      // Data from form is valid.
          post.save((err) => {
            if (err) {
              return next(err);
            }
            // Message saved. Redirect to main page.
            res.json({post});
          });
        }
  // },
// ];
/*
// Display Message delete form on GET.
exports.message_delete_get = (req, res) => {
  async.parallel(
    {
      message(callback) {
        Message.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.message == null) {
        // No results.
        const err = new Error("Message not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("message", {
        title: "Message Details",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};
*/
// Handle Message delete on POST.
/*
exports.message_delete_post = (req, res) => {
  async.parallel(
    {
      message(callback) {
        Message.findById(req.params.messageid).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      
      // Delete object and redirect to the main page.
      console.log('going to delete message with id', req.params.messageid, req.params)
      Message.findByIdAndRemove(req.params.messageid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to main page
        res.redirect("/");
      });
    }
  );
};
/*
// Display Genre update form on GET.
exports.genre_update_get = (req, res, next) => {
  // Get genre for form.
          Genre.findById(req.params.id)
          .exec(function (err, genre) {
              if (err) {
                  return next(err);
              }
              if (genre == null) {
                  // No results.
                  const err = new Error("Genre not found");
                  err.status = 404;
                  return next(err);
              }
              // Success.
              res.render("genre_form", {
                  title: "Update Genre",
                  genre: genre
              });
          });
  };

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize fields.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

      // Create an Genre object with escaped and trimmed data.
      const genre = new Genre({
          name: req.body.name,
          _id: req.params.id, //This is required, or a new ID will be assigned!
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid. Update the record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to genre detail page.
      res.redirect(thegenre.url);
    });
  },
];
*/
