var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get('/', message_controller.message_list);

router.get("/sign-up", user_controller.user_create_get);

router.post("/sign-up", user_controller.user_create_post);

router.get("/join", user_controller.user_join_get);

router.post("/join", user_controller.user_join_post);

// LOGIN ROUTES
router.get("/login", user_controller.user_login_get);

router.post("/login", user_controller.user_login_post);

router.get("/logout", user_controller.user_logout);

// MESSAGE ROUTES
router.get("/messages", message_controller.message_list);

router.get("/createmessage", message_controller.message_create_get);

router.post("/createmessage", message_controller.message_create_post);

router.post("/deletemessage/:messageid", message_controller.message_delete_post);

module.exports = router;
