const userRepo = require("../repositories/userRepository");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const loginPage = (req, res) => res.render("auth/login");

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo.findUserByUsername(username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = {
      userId: user.userId,
      username: user.username,
      role: user.role,
    };
    return res.redirect("/");
  }
  res.render("auth/login", { error: "Sai tài khoản hoặc mật khẩu" });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

// Hàm tiện ích tạo user admin ban đầu (chạy 1 lần rồi xóa route này hoặc để dev)
const seedAdmin = async (req, res) => {
  const hash = bcrypt.hashSync("admin123", 10);
  const admin = {
    userId: uuidv4(),
    username: "admin",
    password: hash,
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  await userRepo.createUser(admin);
  res.send("Admin created: admin/admin123");
};

module.exports = { loginPage, login, logout, seedAdmin };
