const User = require("../models/user");
const async = require("async");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

// Display User create form on GET.
exports.user_create_get = (req, res, next) => {
    res.render("sign-up-form", { title: "Create User" });
  };

// Handle User create on POST.
exports.user_create_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("username")
    .isEmail()
    .escape()
    .withMessage("Invalid username, should be email"),
  body("password")
  .isLength({ min: 1 })
  .escape()
  .withMessage("Invalid password"),
  body("confirmpassword")
  .isLength({ min: 1 })
  .escape()
  .custom((value, { req }) => value === req.body.password)
  .withMessage("Passwords do not match"),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("sign-up-form", {
        title: "Create User",
        user: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      // if err, do something
      if (err) { 
          return next(err);
        }
      // otherwise, store hashedPassword in DB
      // Create an User object with escaped and trimmed data.
    const user = new User({
      firstname: req.body.first_name,
      lastname: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to main page.
      res.redirect('/');
    });
  });  
  },
];

// Display User join form on GET.
exports.user_join_get = (req, res, next) => {
  res.render("join-form", { title: "Join the club" });
};


// Handle User join on POST.
exports.user_join_post = [
  // Validate and sanitize fields.
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Passcode must be specified."),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("join-form", {
        title: "Join the club",
        passcode: req.body.passcode,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.
    if (req.body.passcode === process.env.JOIN_PASSCODE || req.body.passcode === process.env.ADMIN_PASSCODE) {

      const newStatus = req.body.passcode === process.env.ADMIN_PASSCODE || res.locals.membershipStatus === 'Admin' ? 'Admin' : 'Member'

      const user = new User({...res.locals.currentUser, _id: res.locals.currentUser._id.toString(), membershipStatus: newStatus});
      User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err, theuser) => {
        if (err) {
          return next(err);
        }
        // Successful: reload the forme.
        res.render("join-form", {
          title: "Join the club",
          errors: errors.array(),
          comment: newStatus === 'Admin' ? 'Ohhh, you knew the TOP SECRET admin passcode! Now, go and do stuff!' : 'You knew the secret passcode! Welcome to the club!'
        }); 
      }); 
    } else {
      res.render("join-form", {
        title: "Join the club",
        passcode: req.body.passcode,
        errors: errors.array(),
        comment: "You don't know the passcode. You can't join the club!"
      }); 
    }
  },
];

// Display User login form on GET.
exports.user_login_get = (req, res, next) => {
  res.render("login-form", { title: "Log in" });
};

// Handle User login form on POST.
exports.user_login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  });

// Handle User logout on GET.
exports.user_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
});

/*
// Display Author delete form on GET.
exports.author_delete_get = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.params.id).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.author == null) {
          // No results.
          res.redirect("/catalog/authors");
        }
        // Successful, so render.
        res.render("author_delete", {
          title: "Delete Author",
          author: results.author,
          author_books: results.authors_books,
        });
      }
    );
  };
  
// Handle Author delete on POST.
exports.author_delete_post = (req, res, next) => {
    async.parallel(
      {
        author(callback) {
          Author.findById(req.body.authorid).exec(callback);
        },
        authors_books(callback) {
          Book.find({ author: req.body.authorid }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        // Success
        if (results.authors_books.length > 0) {
          // Author has books. Render in same way as for GET route.
          res.render("author_delete", {
            title: "Delete Author",
            author: results.author,
            author_books: results.authors_books,
          });
          return;
        }
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, (err) => {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/catalog/authors");
        });
      }
    );
  };
  
// Display Author update form on GET.
exports.author_update_get = (req, res, next) => {
// Get author for form.
        Author.findById(req.params.id)
        .exec(function (err, author) {
            if (err) {
                return next(err);
            }
            if (author == null) {
                // No results.
                const err = new Error("Author not found");
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render("author_form", {
                title: "Update Author",
                author: author
            });
        });
};

// Handle Author update on POST.
exports.author_update_post = [
    // Validate and sanitize fields.
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified.")
      .isAlphanumeric()
      .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Family name must be specified.")
      .isAlphanumeric()
      .withMessage("Family name has non-alphanumeric characters."),
    body("date_of_birth", "Invalid date of birth")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    body("date_of_death", "Invalid date of death")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

        // Create an Author object with escaped and trimmed data.
        const author = new Author({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
            _id: req.params.id, //This is required, or a new ID will be assigned!
        });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("author_form", {
          title: "Update Author",
          author: author,
          errors: errors.array(),
        });
        return;
      }
      // Data from form is valid. Update the record.
      Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
        if (err) {
          return next(err);
        }
  
        // Successful: redirect to author detail page.
        res.redirect(theauthor.url);
      });
    },
  ];
*/