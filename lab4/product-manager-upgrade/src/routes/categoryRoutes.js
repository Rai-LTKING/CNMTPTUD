const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");
const { requireAdmin } = require("../middlewares/authMiddleware");

router.get("/", requireAdmin, controller.index);
router.get("/add", requireAdmin, controller.addPage);
router.post("/add", requireAdmin, controller.add);
router.post("/delete", requireAdmin, controller.remove);

module.exports = router;
