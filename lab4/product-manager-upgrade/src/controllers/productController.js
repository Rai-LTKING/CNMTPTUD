const productRepo = require("../repositories/productRepository");
const categoryRepo = require("../repositories/categoryRepository");
const { v4: uuidv4 } = require("uuid");

const index = async (req, res) => {
  const { search, categoryId, minPrice } = req.query;
  const products = await productRepo.getAllProducts({
    search,
    categoryId,
    minPrice,
  });
  const categories = await categoryRepo.getAllCategories();

  res.render("products/index", {
    products,
    categories,
    user: req.session.user,
    filters: { search, categoryId, minPrice },
  });
};

const addPage = async (req, res) => {
  const categories = await categoryRepo.getAllCategories();
  res.render("products/add", { categories });
};

const add = async (req, res) => {
  const { name, price, quantity, categoryId } = req.body;
  const newProduct = {
    id: uuidv4(),
    name,
    price: Number(price),
    quantity: Number(quantity),
    categoryId,
    url_image: req.file ? req.file.location : "",
    createdAt: new Date().toISOString(),
  };

  await productRepo.saveProduct(newProduct, req.session.user.userId);
  res.redirect("/");
};

const editPage = async (req, res) => {
  try {
    const product = await productRepo.getProductById(req.params.id);
    const categories = await categoryRepo.getAllCategories();
    res.render("products/edit", { product, categories });
  } catch (error) {
    console.error("Lỗi khi tải trang chỉnh sửa:", error);
    res.status(500).send("Lỗi hệ thống khi tải dữ liệu sản phẩm.");
  }
};

const edit = async (req, res) => {
  try {
    // 1. Giải nén dữ liệu từ req.body, đảm bảo có categoryId
    const { id, name, price, quantity, categoryId, old_image_url } = req.body;

    // 2. Tạo đối tượng sản phẩm với các thông tin đã cập nhật
    const updatedProduct = {
      id: id,
      name: name,
      price: Number(price),
      quantity: Number(quantity),
      categoryId: categoryId, // Quan trọng: Cập nhật ID danh mục mới
      url_image: req.file ? req.file.location : old_image_url,
      updatedAt: new Date().toISOString(), // Thêm thời gian cập nhật
    };

    // 3. Lưu sản phẩm (PutCommand trong repository sẽ ghi đè bản ghi cũ)
    await productRepo.saveProduct(
      updatedProduct,
      req.session.user.userId,
      true,
    );

    res.redirect("/");
  } catch (error) {
    console.error("Lỗi khi lưu chỉnh sửa sản phẩm:", error);
    res.status(500).send("Không thể lưu các thay đổi của sản phẩm.");
  }
};

const remove = async (req, res) => {
  await productRepo.softDeleteProduct(req.body.id, req.session.user.userId);
  res.redirect("/");
};

module.exports = { index, addPage, add, editPage, edit, remove };
