const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage: storage });

router.get("/", productController.listProducts);
router.get("/add", (req, res) => res.render("add"));
router.post("/add", upload.single("image"), productController.addProduct);
router.get("/detail/:id", productController.viewDetail);
router.get("/delete/:id", productController.deleteProduct);
router.get("/edit/:id", productController.editProduct);
router.post("/edit", upload.single("image"), productController.updateProduct);

module.exports = router;
