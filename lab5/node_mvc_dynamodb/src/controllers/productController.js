const Product = require("../models/productModel");

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.render("index", { products });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addProduct = async (req, res) => {
  const { id, name, price, url_image } = req.body;
  await Product.save({ id, name, price: Number(price), url_image });
  res.redirect("/");
};

// Hiển thị form sửa
exports.editPage = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render("edit", { product });
};

// Xử lý cập nhật
exports.updateProduct = async (req, res) => {
  const { id, name, price, url_image } = req.body;
  await Product.save({ id, name, price: Number(price), url_image });
  res.redirect("/");
};

// Xử lý xóa
exports.deleteProduct = async (req, res) => {
  await Product.delete(req.params.id);
  res.redirect("/");
};
