const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Access Denied: Chỉ Admin mới có quyền này.");
  }
  next();
};

module.exports = { requireLogin, requireAdmin };
