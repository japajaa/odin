var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.post("/create", user_controller.user_create);

// GET request for list of all users.
router.get("/", user_controller.user_list);

module.exports = router;