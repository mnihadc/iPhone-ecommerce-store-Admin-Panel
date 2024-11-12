const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    console.log("Token:", token); // Add this line for debugging

    if (!token) {
      return res.redirect("/get-login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("JWT Error:", err); // Log JWT verification error
        return res.redirect("/get-login");
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken:", error); // Log the caught error
    res.status(500).send("Something went wrong.");
  }
};

module.exports = verifyToken;
