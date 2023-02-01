const Category = require("../models/category");
const Dish = require("../models/dish");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Categories.
exports.category_list = function (req, res, next) {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("category_list", {
        title: "Kategorioiden Listaus",
        category_list: list_categories,
      });
    });
};

// Display detail page for a specific Genre.
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_dishes(callback) {
        Dish.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_detail", {
        title: "Kategorian tiedot",
        category: results.category,
        category_dishes: results.category_dishes,
      });
    }
  );
};

// Display Category create form on GET.
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Luo kategoria" });
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Kategorian nimi on pakollinen tieto").trim().isLength({ min: 1 }).escape(),
  body("type", "Kategorian tyyppi on pakollinen tieto")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name, type: req.body.type });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Luo kategoria",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: req.body.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.category_delete_get = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_dishes(callback) {
        Dish.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_delete", {
        title: "Poista kategoria",
        category: results.category,
        category_dishes: results.category_dishes,
      });
    }
  );
};

// Handle Category delete on POST.
exports.category_delete_post = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      category_dishes(callback) {
        Dish.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.category_dishes.length > 0) {
        // Category has dishes. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Poista kategoria",
          category: results.category,
          category_dishes: results.category_dishes,
        });
        return;
      }
      // Category has no dishes. Delete object and redirect to the list of category.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to categories list
        res.redirect("/dishes/categories");
      });
    }
  );
};

// Display Category update form on GET.
exports.category_update_get = (req, res, next) => {
  // Get category for form.
          Category.findById(req.params.id)
          .exec(function (err, category) {
              if (err) {
                  return next(err);
              }
              if (category == null) {
                  // No results.
                  const err = new Error("Category not found");
                  err.status = 404;
                  return next(err);
              }
              // Success.
              res.render("category_form", {
                  title: "Muokkaa kategoriaa",
                  category: category
              });
          });
  };

// Handle Category update on POST.
exports.category_update_post = [
  // Validate and sanitize fields.
  body("name", "Kategorian nimi on pakollinen tieto").trim().isLength({ min: 1 }).escape(),
  body("type", "Kategorian tyyppi on pakollinen tieto").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

      // Create an Category object with escaped and trimmed data.
      const category = new Category({
          name: req.body.name,
          type: req.body.type,
          _id: req.params.id, //This is required, or a new ID will be assigned!
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("category_form", {
        title: "Muokkaa kategoriaa",
        category: category,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid. Update the record.
    Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to category detail page.
      res.redirect(thecategory.url);
    });
  },
];