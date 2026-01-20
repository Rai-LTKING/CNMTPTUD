const express = require("express");
const session = require("express-session");
const app = express();
const productRoutes = require("./routes/product.routes");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use("/", productRoutes);

app.listen(3000, () => console.log("Server running: http://localhost:3000"));
