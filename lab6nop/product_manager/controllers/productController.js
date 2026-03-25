const ProductModel = require("../models/productModel");
const fs = require("fs");
const path = require("path");

// Danh sách sản phẩm
exports.listProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let products;

    if (search) {
      products = await ProductModel.searchByName(search);
    } else {
      products = await ProductModel.getAll();
    }

    res.render("index", { products, searchQuery: search || "" });
  } catch (error) {
    res.status(500).send("Lỗi lấy danh sách");
  }
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { name, price, unit_in_stock } = req.body;
  const url_image = req.file ? `/uploads/${req.file.filename}` : "";
  const { v4: uuidv4 } = await import("uuid");

  await ProductModel.save({
    id: uuidv4(),
    name,
    price: Number(price),
    unit_in_stock: Number(unit_in_stock),
    url_image,
  });
  res.redirect("/");
};

// Hiển thị form sửa
exports.editProduct = async (req, res) => {
  const product = await ProductModel.getById(req.params.id);
  res.render("edit", { product });
};

// Cập nhật sản phẩm và xử lý ảnh cũ
exports.updateProduct = async (req, res) => {
  const { id, name, price, unit_in_stock } = req.body;
  const oldProduct = await ProductModel.getById(id);
  let url_image = oldProduct.url_image;

  if (req.file) {
    // Nếu có ảnh mới, xóa ảnh cũ trong thư mục public
    if (oldProduct.url_image) {
      const oldPath = path.join(__dirname, "../public", oldProduct.url_image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    url_image = `/uploads/${req.file.filename}`;
  }

  await ProductModel.save({
    id,
    name,
    price: Number(price),
    unit_in_stock: Number(unit_in_stock),
    url_image,
  });
  res.redirect("/");
};

// Xóa sản phẩm và xóa ảnh vật lý
exports.deleteProduct = async (req, res) => {
  const product = await ProductModel.getById(req.params.id);
  if (product && product.url_image) {
    const imgPath = path.join(__dirname, "../public", product.url_image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }
  await ProductModel.delete(req.params.id);
  res.redirect("/");
};

exports.viewDetail = async (req, res) => {
  const product = await ProductModel.getById(req.params.id);
  res.render("detail", { product });
};
