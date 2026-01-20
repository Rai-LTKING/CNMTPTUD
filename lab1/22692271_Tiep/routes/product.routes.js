const express = require("express");
const router = express.Router();
const db = require("../db/mysql");

const checkAuth = (req, res, next) => {
  if (req.session.isLoggedIn) return next();
  res.redirect("/login");
};

router.get("/login", (req, res) => res.render("login"));
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "123") {
    req.session.isLoggedIn = true;
    res.redirect("/");
  } else {
    res.send("Sai tài khoản hoặc mật khẩu!");
  }
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// --- CRUD ROUTES ---
router.get("/", checkAuth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products");
  res.render("products", { products: rows });
});

router.post("/add", checkAuth, async (req, res) => {
  const { name, price, quantity } = req.body;
  await db.query(
    "INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)",
    [name, price, quantity],
  );
  res.redirect("/");
});

router.get("/edit/:id", checkAuth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
    req.params.id,
  ]);
  res.render("edit", { product: rows[0] });
});

router.post("/update/:id", checkAuth, async (req, res) => {
  const { name, price, quantity } = req.body;
  await db.query("UPDATE products SET name=?, price=?, quantity=? WHERE id=?", [
    name,
    price,
    quantity,
    req.params.id,
  ]);
  res.redirect("/");
});

router.get("/delete/:id", checkAuth, async (req, res) => {
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.redirect("/");
});

module.exports = router;
