const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const productController = require("./src/controllers/productController");

const app = express();

// Cấu hình View Engine (EJS) [cite: 162]
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", productController.listProducts);
app.post("/add", productController.addProduct);

// ... (phần code cũ)
app.get("/", productController.listProducts);
app.post("/add", productController.addProduct);
app.get("/edit/:id", productController.editPage); // Trang sửa
app.post("/update", productController.updateProduct); // Xử lý sửa
app.get("/delete/:id", productController.deleteProduct); // Xóa

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
