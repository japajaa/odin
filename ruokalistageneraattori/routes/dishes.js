var express = require('express');
var router = express.Router();

// Require controller modules.
const dish_controller = require("../controllers/dishController");
const category_controller = require("../controllers/categoryController");



/// DISH ROUTES ///

// GET dishes home page.
router.get("/", dish_controller.index);

// GET request for creating a Dish. NOTE This must come before routes that display Dish (uses id).
router.get("/dish/create", dish_controller.dish_create_get);

// POST request for creating Dish.
router.post("/dish/create", dish_controller.dish_create_post);

// GET request for one Dish.
router.get("/dish/:id", dish_controller.dish_detail);

// GET request for list of all Dish items.
router.get("/dishes", dish_controller.dish_list);

// GET request to delete Dish.
router.get("/dish/:id/delete", dish_controller.dish_delete_get);

// POST request to delete Dish.
router.post("/dish/:id/delete", dish_controller.dish_delete_post);

// GET request to update Dish.
router.get("/dish/:id/update", dish_controller.dish_update_get);

// POST request to update Dish.
router.post("/dish/:id/update", dish_controller.dish_update_post);



/// Category ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Category items.
router.get("/categories", category_controller.category_list);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);


module.exports = router;
