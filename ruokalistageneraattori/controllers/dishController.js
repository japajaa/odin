const Dish = require("../models/dish");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");


exports.index = (req, res) => {
  async.parallel(
    {
      dish_count(callback) {
        Dish.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Suomen paras ruokalistageneraattori",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all Dishes.
exports.dish_list = function (req, res, next) {
    Dish.find({}, "name category")
      .sort({ name: 1 })
      .populate("category")
      .exec(function (err, list_dishes) {
        if (err) {
          return next(err);
        }
        //Successful, so render
        res.render("dish_list", { title: "Ruokalajit luettelona", dish_list: list_dishes });
      });
  };
  
// Display detail page for a specific dish.
exports.dish_detail = (req, res, next) => {
    async.parallel(
      {
        dish(callback) {
          Dish.findById(req.params.id)
            .populate("category")
            .exec(callback);
        }
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.dish == null) {
          // No results.
          const err = new Error("Dish not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render.
        res.render("dish_detail", {
          title: results.dish.name,
          dish: results.dish
        });
      }
    );
  };


// Display dish create form on GET.
exports.dish_create_get = (req, res, next) => {
    // Get all categories, which we can use for adding to our book.
    async.parallel(
      {
        categories(callback) {
          Category.find(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.render("dish_form", {
          title: "Luo ruokalaji",
          categories: results.categories,
        });
      }
    );
  };
  
// Handle dish create on POST.
exports.dish_create_post = [
    // Convert the category to an array.
    (req, res, next) => {
      if (!Array.isArray(req.body.category)) {
        req.body.category =
          typeof req.body.category === "undefined" ? [] : [req.body.category];
      }
      next();
    },
  
    // Validate and sanitize fields.
    body("name", "Nimi on pakollinen tieto")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("servings", "Ruokailukertojen lukumäärä")
      .trim()
      .isInt ({ min:1, max: 5})
      .withMessage('Ruokailukertojen lukumäärä täytyy olla välillä 1 - 5')
      .escape(),
    body("category.*").escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Dish object with escaped and trimmed data.
      const dish = new Dish({
        name: req.body.name,
        servings: req.body.servings,
        category: req.body.category,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all categories for form.
        async.parallel(
          {
            categories(callback) {
              Category.find(callback);
            },
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
  
            // Mark our selected categories as checked.
            for (const category of results.categories) {
              if (dish.category.includes(category._id)) {
                category.checked = "true";
              }
            }
            res.render("dish_form", {
              title: "Luo ruokalaji",
              categories: results.categories,
              dish,
              errors: errors.array(),
            });
          }
        );
        return;
      }
  
      // Data from form is valid. Save dish.
      dish.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful: redirect to new dish record.
        res.redirect(dish.url);
      });
    },
  ];  

// Display dish delete form on GET.
exports.dish_delete_get = (req, res, next) => {
    async.parallel(
      {
        dish(callback) {
          Dish.findById(req.params.id).exec(callback);
        }
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.dish == null) {
          // No results.
          res.redirect("/dishes/dishes");
        }
        // Successful, so render.
        res.render("dish_delete", {
          title: "Poista ruokalaji",
          dish: results.dish
        });
      }
    );
  };

// Handle dish delete on POST.
exports.dish_delete_post = (req, res, next) => {
    async.parallel(
      {
        dish(callback) {
          Dish.findById(req.body.dishid).exec(callback);
        }
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        // Success. Delete object and redirect to the list of dishes.
        Dish.findByIdAndRemove(req.body.dishid, (err) => {
          if (err) {
            return next(err);
          }
          // Success - go to dish list
          res.redirect("/dishes/dishes");
        });
      }
    );
  };

// Display dish update form on GET.
exports.dish_update_get = (req, res, next) => {
    // Get dish and categories for form.
    async.parallel(
      {
        dish(callback) {
          Dish.findById(req.params.id)
            .populate("category")
            .exec(callback);
        },
        categories(callback) {
          Category.find(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.dish == null) {
          // No results.
          const err = new Error("Dish not found");
          err.status = 404;
          return next(err);
        }
        // Success.
        // Mark our selected categories as checked.
        for (const category of results.categories) {
          for (const dishCategory of results.dish.category) {
            if (category._id.toString() === dishCategory._id.toString()) {
              category.checked = "true";
            }
          }
        }
        res.render("dish_form", {
          title: "Muokkaa ruokalajia",
          categories: results.categories,
          dish: results.dish,
        });
      }
    );
  };

// Handle dish update on POST.
exports.dish_update_post = [
    // Convert the category to an array
    (req, res, next) => {
      if (!Array.isArray(req.body.category)) {
        req.body.category =
          typeof req.body.category === "undefined" ? [] : [req.body.category];
      }
      next();
    },
  
// Validate and sanitize fields.
body("name", "Nimi on pakollinen tieto")
.trim()
.isLength({ min: 1 })
.escape(),
body("servings", "Ruokailukertojen lukumäärä")
.trim()
.isInt ({ min:1, max: 5})
.withMessage('Ruokailukertojen lukumäärä täytyy olla välillä 1 - 5')
.escape(),
body("category.*").escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Dish object with escaped/trimmed data and old id.
      const dish = new Dish({
        name: req.body.name,
        servings: req.body.servings,
        category: typeof req.body.category === "undefined" ? [] : req.body.category,
        _id: req.params.id, //This is required, or a new ID will be assigned!
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        // Get all categories for form.
        async.parallel(
          {
            categories(callback) {
              Category.find(callback);
            },
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
  
            // Mark our selected categories as checked.
            for (const category of results.categories) {
              if (dish.category.includes(category._id)) {
                category.checked = "true";
              }
            }
            res.render("dish_form", {
              title: "Muokkaa ruokalajia",
              categories: results.categories,
              dish,
              errors: errors.array(),
            });
          }
        );
        return;
      }
  
      // Data from form is valid. Update the record.
      Dish.findByIdAndUpdate(req.params.id, dish, {}, (err, thedish) => {
        if (err) {
          return next(err);
        }
  
        // Successful: redirect to dish detail page.
        res.redirect(thedish.url);
      });
    },
  ];