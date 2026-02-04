const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.get("/login", controller.loginPage);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/seed", controller.seedAdmin); // Chạy 1 lần để tạo admin

module.exports = router;
