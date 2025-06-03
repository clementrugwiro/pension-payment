const authorizeNotUser = (req, res, next) => {
    if (!req.user || req.user.role === "user") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  };
  
  module.exports = authorizeNotUser;
  