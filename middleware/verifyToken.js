const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.redirect("/auth/get-login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect("/auth/get-login");
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).send("Something went wrong.");
  }
};

module.exports = verifyToken;
