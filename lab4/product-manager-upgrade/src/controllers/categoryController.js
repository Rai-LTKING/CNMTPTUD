const categoryRepo = require("../repositories/categoryRepository");
const { v4: uuidv4 } = require("uuid");

const index = async (req, res) => {
  const categories = await categoryRepo.getAllCategories();
  res.render("categories/index", { categories });
};

const addPage = (req, res) => res.render("categories/add");

const add = async (req, res) => {
  const { name, description } = req.body;
  await categoryRepo.saveCategory({
    categoryId: uuidv4(),
    name,
    description,
  });
  res.redirect("/categories");
};

const remove = async (req, res) => {
  // Lưu ý: Cần kiểm tra xem category có đang được dùng bởi Product nào không trước khi xóa (Business Rule)
  await categoryRepo.deleteCategory(req.body.id);
  res.redirect("/categories");
};

module.exports = { index, addPage, add, remove };
