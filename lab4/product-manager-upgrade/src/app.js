require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares cơ bản
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session setup
app.use(
  session({
    secret: "my-secret-key-123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Đặt true nếu dùng HTTPS
  }),
);

// Global variable cho Views (để check role user)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", productRoutes); // Home page is product list
app.use("/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
