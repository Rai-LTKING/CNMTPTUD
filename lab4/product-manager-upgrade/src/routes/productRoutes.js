const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const upload = require("../middlewares/uploadMiddleware");
const { requireLogin, requireAdmin } = require("../middlewares/authMiddleware");

// Public hoặc Staff xem được
router.get("/", requireLogin, controller.index);

// Chỉ Admin mới được Thêm/Sửa/Xóa
router.get("/add", requireAdmin, controller.addPage);
router.post("/add", requireAdmin, upload.single("image"), controller.add);

router.get("/edit/:id", requireAdmin, controller.editPage);
router.post("/edit", requireAdmin, upload.single("image"), controller.edit);

router.post("/delete", requireAdmin, controller.remove);

module.exports = router;
